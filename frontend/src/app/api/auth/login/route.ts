export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username !== 'admin' && password !== 'admin')
    return new Response(JSON.stringify({ access_token: 'DEMO_TOKEN' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  return new Response(
    JSON.stringify({ message: 'Unauthorized', statusCode: 401 }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
