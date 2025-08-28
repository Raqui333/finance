import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return new NextResponse(
    JSON.stringify({ asset: { id: 1, ...body, holder_id: 1 } }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function GET() {
  const date = new Date();
  const isoString = date.toISOString();

  const entry = [
    {
      id: 1,
      date: isoString,
      name: 'Google',
      description: 'Google Stock',
      price: 100.99,
      holder_id: 1,
    },
  ];

  return new NextResponse(JSON.stringify(entry), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
