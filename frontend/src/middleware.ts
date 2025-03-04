import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const public_routes = ['/auth/login', '/auth/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivateRoute = !public_routes.includes(pathname);

  if (isPrivateRoute && !req.cookies.has('access_token'))
    return NextResponse.redirect(new URL('/auth/login', req.url));

  if (pathname.startsWith('/auth') && req.cookies.has('access_token'))
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*'],
};
