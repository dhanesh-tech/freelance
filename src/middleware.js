import { NextResponse } from 'next/server';
import { verifyAccessToken } from './utils/auth';

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/signin' || path === '/signup';

  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;

  // Redirect logic
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/profile',
    '/api/protected/:path*',
  ],
}; 