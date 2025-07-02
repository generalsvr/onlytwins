// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { locales } from '@/i18n';

const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale
      }
    }
  }

  return defaultLocale
}

async function refreshTokens(request: NextRequest): Promise<NextResponse | null> {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return null
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      },
      body:JSON.stringify({}),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const { access_token, refresh_token, expires_in, refresh_expires_in } = data

    // Создаем новый response с обновленными куками
    const nextResponse = NextResponse.next()

    const accessTokenExpires = new Date(Date.now() + expires_in * 1000)
    const refreshTokenExpires = new Date(Date.now() + refresh_expires_in * 1000)

    nextResponse.cookies.set('access_token', access_token, {
      expires: accessTokenExpires,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    nextResponse.cookies.set('refresh_token', refresh_token, {
      expires: refreshTokenExpires,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return nextResponse

  } catch (error) {
    console.error('Error refreshing tokens:', error)
    return null
  }
}

function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    const bufferTime = currentTime + bufferSeconds // добавляем буфер

    // Проверяем exp поле с учетом буфера
    return payload.exp ? payload.exp < bufferTime : false
  } catch (error) {
    console.error('Error parsing token:', error)
    return true
  }
}
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (pathname === '/auth/google/callback') {
    const queryParams = Object.fromEntries(searchParams.entries())
    if(queryParams?.state && queryParams?.code){
      console.log(queryParams.state, queryParams.code)
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/google/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          "code": queryParams.code,
          "state": queryParams.state
        }),
      }).then(res => res.json())
      console.log(response)
      const newUrl = new URL(`/${defaultLocale}`, request.url)
      const nextResponse = NextResponse.redirect(newUrl)
      if(response?.tokens){
        const accessTokenExpires = new Date(Date.now() + response.tokens.expires_in * 1000)
        const refreshTokenExpires = new Date(Date.now() + response.tokens.refresh_expires_in * 1000)

        nextResponse.cookies.set('access_token', response.tokens.access_token, {
          expires: accessTokenExpires,
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
        })

        nextResponse.cookies.set('refresh_token', response.tokens.refresh_token, {
          expires: refreshTokenExpires,
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
        })
      }
      return nextResponse
    }
  }
  // Google callback query params: {
  //   state: 'tvub2o89stcz9qo8wjpq',
  //     code: '4/0AVMBsJgBFIW9aiRSrJt6ipQ8_jXq6nzsiP--KkzgWG5HJTjV3Ytwr3ng_yZLA4GO9bhr7A',
  //     scope: 'email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
  //     authuser: '1',
  //     prompt: 'consent'
  // }

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value
  if ((!accessToken || isTokenExpired(accessToken, 120)) && refreshToken) {

    const refreshResponse = await refreshTokens(request)

    if (refreshResponse) {
      // Токены успешно обновлены, продолжаем с обновленными куками
      const { pathname } = request.nextUrl

      // Проверяем локализацию для обновленного запроса
      const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
      )

      if (!pathnameHasLocale) {
        const locale = getLocale(request)
        const newUrl = new URL(`/${locale}${pathname}`, request.url)

        // Копируем куки из refreshResponse в redirect response
        const redirectResponse = NextResponse.redirect(newUrl)
        refreshResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            expires: cookie.expires,
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
          })
        })

        return redirectResponse
      }

      return refreshResponse
    } else {
      const locale = getLocale(request)
      const loginUrl = new URL(`/${locale}/`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Токен валиден, проверяем локализацию
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
}