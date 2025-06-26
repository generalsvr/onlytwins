// app/api/auth/[...path]/route.ts
import { NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://platform.onlytwins.ai/api/v1';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const { searchParams } = new URL(request.url);
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}?${searchParams.toString()}`;
  const authToken = request.headers.get('Authorization');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(authToken && { Authorization: authToken }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: response.statusText },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: Error) {
    console.error('Actual Request URL:', url);
    console.error('API Error:', {
      message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 403 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}`;
  const body = await request.json();
  const authToken = request.headers.get('Authorization');
  const isServerAction = request.headers.get('ServerAction') === 'true';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: authToken }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const resp = NextResponse.json(data);
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Request failed' },
        { status: response.status }
      );
    }

    // Если это запрос на обновление токенов через Server Action
    if (path === 'auth/refresh' && isServerAction) {
      try{
        if (data['access_token']) {
          resp.cookies.set('access_token', data['access_token'], {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: data['expires_in'],
            path:'/'
          });
        }

        if (data['refresh_token']) {
          resp.cookies.set('refresh_token', data['refresh_token'], {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: data['refresh_expires_in'],
            path:'/'
          });
        }
      } catch(error){
        console.log(error);
      }

    }

    return resp;
  } catch (error: Error) {
    console.log('error', error);
    console.error('API Error:', {
      message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}`;
  const body = await request.json();
  const authToken = request.headers.get('Authorization');

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...(authToken && { Authorization: authToken }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
    });
    return NextResponse.json(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}`;
  const body = await request.json();
  const authToken = request.headers.get('Authorization');


  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...(authToken && { Authorization: authToken }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  } catch (error: Error) {
    console.error('API Error:', {
      message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}
