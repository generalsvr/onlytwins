// app/api/auth/[...path]/route.ts
import { NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://platform.onlytwins.ai/api/v1';

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
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
        'Accept': 'application/json'
      },
    });

    console.log('Actual Request URL:', url);
    console.log('Actual Query Parameters:', searchParams.toString());

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error: Error) {
    console.error('Actual Request URL:', url);
    console.error('API Error:', {
      message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}`;
  const body = await request.json();
  const authToken = request.headers.get('Authorization');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: authToken }),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

export async function PUT(request: Request, { params }: { params: { path: string[] } }) {
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
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        data: data,
        detail: data?.error?.details,
        message:data?.error?.message
      });

      return NextResponse.json(
        { error: data?.error?.message || 'Request failed', status:response.status },
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

export async function PATCH(request: Request, { params }: { params: { path: string[] } }) {
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
        'Accept': 'application/json'
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