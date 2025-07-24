import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (username !== 'admin' && password !== 'admin')
    return new NextResponse(JSON.stringify({ access_token: 'DEMO_TOKEN' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  return new NextResponse(
    JSON.stringify({ message: 'Unauthorized', statusCode: 401 }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
