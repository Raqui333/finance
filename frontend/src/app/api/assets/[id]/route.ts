import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, context: any) {
  const id = context.params?.id;

  return new NextResponse(JSON.stringify({ id: Number(id) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
