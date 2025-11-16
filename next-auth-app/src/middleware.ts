import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Simple middleware that checks for a valid NextAuth JWT token on protected
// routes and redirects to `/signin` if not authenticated.
export async function middleware(req: NextRequest) {
	try {
		const { pathname } = req.nextUrl;

		// Only apply auth checks to these protected paths (also configured in `config`).
		if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
			const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
			if (!token) {
				const url = req.nextUrl.clone();
				url.pathname = '/signin';
				return NextResponse.redirect(url);
			}
		}

		return NextResponse.next();
	} catch (err) {
		// On any error, allow the request to continue (fail-open) but log for debugging.
		console.error('middleware error', err);
		return NextResponse.next();
	}
}

export const config = { matcher: ['/dashboard', '/profile'] };

export default middleware;