import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const API = process.env.API_URL || 'http://localhost:3000';

const public_routes = ['/auth/login', '/auth/register'];

async function validadeToken(token: string | undefined) {
  if (!token) return false;

  const resp = await fetch(`${API}/auth/validate-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (resp.status === 401) return false;

  return true;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  const isPrivateRoute = !public_routes.includes(pathname);
  const isValidToken = await validadeToken(token);

  if (isPrivateRoute && !isValidToken)
    return NextResponse.redirect(new URL('/auth/login', req.url));

  if (pathname.startsWith('/auth') && isValidToken)
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*'],
};
