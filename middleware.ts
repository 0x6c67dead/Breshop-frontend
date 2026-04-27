import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Owner specific views if any (e.g. /my-shop)
  if (pathname.startsWith('/shop-dashboard')) {
    if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/shop-dashboard/:path*'],
};
