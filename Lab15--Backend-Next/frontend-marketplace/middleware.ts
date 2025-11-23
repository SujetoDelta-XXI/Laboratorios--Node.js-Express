import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Protect /admin route server-side by validating cookie with backend
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    try {
      const meRes = await fetch(`${BACKEND_API}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { cookie: req.headers.get('cookie') || '' }
      });
      if (!meRes.ok) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      const data = await meRes.json();
      if (!data.user || data.user.role !== 'ADMIN') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    } catch (err) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
