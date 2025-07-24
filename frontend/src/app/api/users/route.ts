export async function GET() {
  const user = {
    id: 1,
    name: 'Admin',
    username: 'admin',
    email: 'admin@admin.com',
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
