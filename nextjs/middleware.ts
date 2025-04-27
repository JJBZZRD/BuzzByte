import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose instead of jsonwebtoken in Edge Runtime

// Routes we want to exclude from analytics tracking
const EXCLUDE_ROUTES = [
  '/api/',
  '/_next/',
  '/favicon.ico',
];

// Define protected paths that require authentication
const protectedPaths = [
  '/admin/project-management',
  '/analytics',
  '/admin/messages',
];

// Admin API endpoints that should be CSRF protected
const adminApiEndpoints = [
  '/api/projects',
  '/api/auth/logout',
  '/api/admin/messages',
];

/**
 * Middleware function that sets up basic routing and headers
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Set X-CSRF-Protection header for all responses
  response.headers.set('X-CSRF-Protection', '1; mode=block');
  
  // Check if this is an admin API endpoint that needs CSRF protection
  const isAdminApiEndpoint = adminApiEndpoints.some(endpoint => 
    pathname.startsWith(endpoint)
  );
  
  if (isAdminApiEndpoint && request.method !== 'GET') {
    // For non-GET requests to admin API endpoints, verify the origin and referer
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Get the hostname from the request
    const host = request.headers.get('host');
    const expectedOrigin = `${request.headers.get('x-forwarded-proto') || 'http'}://${host}`;
    
    // If origin is present, it must match our expected origin
    if (origin && !origin.startsWith(expectedOrigin)) {
      return new NextResponse(JSON.stringify({ error: 'CSRF check failed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If referer is present, it must start with our expected origin
    if (referer && !referer.startsWith(expectedOrigin)) {
      return new NextResponse(JSON.stringify({ error: 'CSRF check failed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check for CSRF token in headers for extra security on important endpoints
    if (pathname.includes('/api/projects/') && request.method === 'DELETE') {
      const csrfToken = request.headers.get('x-csrf-token');
      const tokenFromCookie = request.cookies.get('csrf_token')?.value;
      
      if (!csrfToken || !tokenFromCookie || csrfToken !== tokenFromCookie) {
        return new NextResponse(JSON.stringify({ error: 'Invalid CSRF token' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If it's not a protected path, continue
  if (!isProtectedPath) {
    return response;
  }
  
  // Check for auth token
  const token = request.cookies.get('admin_token')?.value;

  // If there's no token and this is a protected path, redirect to login
  if (!token) {
    // Create the URL to redirect to
    const url = new URL('/admin', request.url);
    return NextResponse.redirect(url);
  }
  
  // Validate the token
  try {
    // Get the JWT_SECRET from environment variables
    // In middleware, we need to access environment variables that are exposed to the browser
    // Using process.env.JWT_SECRET directly won't work in Edge Runtime
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_for_development_only');
    
    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Add debug header showing the expiration time (for debugging only - remove in production)
    if (payload.exp) {
      const expiresAt = new Date(payload.exp * 1000).toISOString();
      const now = new Date().toISOString();
      response.headers.set('X-Auth-Debug', `Token valid until ${expiresAt}, current time: ${now}`);
    }
    
    // Token is valid, allow the request to proceed
    return response;
  } catch (error) {
    // Get a more specific error message
    let errorMessage = 'Unknown token error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error(`Token validation error: ${errorMessage}`);
    
    // For debugging only - in production you'd want to remove this
    console.log(`Token: ${token ? token.substring(0, 10) + '...' : 'empty'}`);
    
    // Token is invalid, redirect to login page
    const url = new URL('/admin', request.url);
    
    // Add query parameter with error info for debugging (remove in production)
    url.searchParams.set('auth_error', encodeURIComponent(errorMessage));
    
    return NextResponse.redirect(url);
  }
}

// Specify routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Next.js internals
     * - Static files (images, CSS, JavaScript)
     */
    '/((?!_next/static|_next/image|images|assets|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.css$|.*\\.js$).*)',
    '/admin/:path*', // Admin routes
    '/analytics', // Analytics page
    '/api/projects/:path*', // Project API routes
    '/api/auth/:path*', // Auth API routes
    '/api/admin/:path*',
  ],
}; 