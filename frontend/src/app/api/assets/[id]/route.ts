export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return new Response(JSON.stringify({ id: Number(id) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
