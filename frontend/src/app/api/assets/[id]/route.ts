import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest, context: any) {
  const id = context.params?.id;

  return new Response(JSON.stringify({ id: Number(id) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
