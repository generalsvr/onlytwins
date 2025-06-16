// app/api/auth/[...path]/route.ts
import { NextResponse } from 'next/server';
import { clientApi } from '@/lib/clientApi';

const EXTERNAL_API_URL = 'https://platform.onlytwins.ai/api/v1';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  const { searchParams } = new URL(request.url);
  const qParams = Object.fromEntries(searchParams);
  const path = resolvedParams.path.join('/');
  const url = `${EXTERNAL_API_URL}/${path}${Object.keys(qParams).length ? '/' : ''}`;
  try {
    const response = await clientApi.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      params: qParams,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data.error.details,
    });
    return NextResponse.json(
      { error: error.response?.data?.message || 'Request failed' },
      { status: error.response?.status || 500 }
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
  console.table({
    url: url,
    token: request.headers.get('Authorization'),
  });
  try {
    const response = await clientApi.post(url, body, {
      headers: {},
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return NextResponse.json(
      { error: error.response?.data?.message || 'Request failed' },
      { status: error.response?.status || 500 }
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
    const response = await clientApi.put(url, body, {
      headers: {},
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      detail: error.response?.data.error.details,
    });
    return NextResponse.json(
      { error: error.response?.data?.message || 'Request failed' },
      { status: error.response?.status || 500 }
    );
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

  try {
    const response = await clientApi.patch(url, body, {
      headers: {
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return NextResponse.json(
      { error: error.response?.data?.message || 'Request failed' },
      { status: error.response?.status || 500 }
    );
  }
}
