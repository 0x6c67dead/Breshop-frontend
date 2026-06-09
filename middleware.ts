import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const ADMIN_ROUTES = ['/admin'];
const OWNER_ROUTES = ['/shop-dashboard', '/extrato'];
const OWNER_BLOCKED = ['/cart', '/minhas-reservas'];
const USER_ROUTES = ['/minhas-reservas', '/favorites', '/profile', '/cart'];

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isOwnerRoute = OWNER_ROUTES.some((r) => pathname.startsWith(r));
  const isOwnerBlocked = OWNER_BLOCKED.some((r) => pathname.startsWith(r));
  const isUserRoute = USER_ROUTES.some((r) => pathname.startsWith(r));

  // Logged-in → not back to auth pages
  if (isAuthPage && userRole) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Not logged in → protected routes redirect to login
  if (!userRole && (isAdminRoute || isOwnerRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ADMIN only
  if (isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // OWNER or ADMIN only
  if (isOwnerRoute && userRole !== 'BRECHO_OWNER' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // BRECHO_OWNER cannot access cart / minhas-reservas
  if (isOwnerBlocked && userRole === 'BRECHO_OWNER') {
    return NextResponse.redirect(new URL('/shop-dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
