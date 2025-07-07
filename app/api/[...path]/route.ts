// app/api/auth/[...path]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setCookie } from '@/app/actions/cookies';

const EXTERNAL_API_URL = process.env.API_URL;

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
  } catch (error: any) {
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
  const authToken = request.headers.get('Authorization');
  let body = null;
  if (request.headers.get('Content-Type')?.includes('multipart/form-data')) {
    body = await request.formData();
  } else {
    body = await request.json();
    body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: authToken }),
      },
      body: body
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.error);
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

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}

// Остальные методы остаются без изменений
export async function PUT(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}`;
  const body = await request.json();
  const telegramAuth = request.headers.get('AuthorizationTelegram');
  const authToken = request.headers.get('Authorization');

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...(authToken && { Authorization: authToken }),
        ...(telegramAuth && { Authorization: telegramAuth }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: telegramAuth ? JSON.stringify({}) : JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.error.details.validation_errors);
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

export async function DELETE(
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
      method: 'DELETE',
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
        { error: data.error },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}
