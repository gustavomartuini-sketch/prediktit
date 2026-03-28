import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // Admin routes - require ADMIN role
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Public routes - no auth required
        const publicPaths = ['/', '/login', '/register', '/markets', '/api/markets', '/api/marketing'];
        if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
          return true;
        }

        // Everything else requires authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/create/:path*', '/admin/:path*', '/api/trade/:path*', '/api/wallet/:path*'],
};
