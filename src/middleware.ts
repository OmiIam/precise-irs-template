
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/file', '/pay', '/refunds', '/credits-deductions', '/forms-instructions'];
  const isPublicPath = publicPaths.some(pp => path === pp || path.startsWith(`${pp}/`));
  
  // Admin paths that require admin role
  const adminPaths = ['/admin-dashboard'];
  const isAdminPath = adminPaths.some(adminPath => path.startsWith(adminPath));
  
  // Check if the path requires authentication
  if (!isPublicPath) {
    // Get the token from the request
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If no token is found, redirect to login
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.append('callbackUrl', path);
      return NextResponse.redirect(url);
    }
    
    // If the path requires admin role but the user is not an admin
    if (isAdminPath && token.role !== 'Admin') {
      const url = new URL('/dashboard', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth (NextAuth paths)
     * 2. /_next (NextJS paths)
     * 3. /images, /fonts, /icons, /favicon.ico, etc. (static assets)
     */
    '/((?!api/auth|_next|images|fonts|icons|favicon.ico).*)',
  ],
};
