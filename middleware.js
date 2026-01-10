import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // 1. Define Public Paths (No Login Required)
    // explicit exact matches
    const publicPaths = ['/login', '/credits', '/api/auth/login']

    const isPublicPath = publicPaths.some(p => path === p || path.startsWith('/api/auth/login'))

    // 2. Check for Auth Token (userId cookie)
    const token = request.cookies.get('userId')?.value

    // 3. Logic: Redirect unauthenticated users to /login
    if (!token && !isPublicPath) {
        // console.log(`[Middleware] No token found for ${path}, redirecting to /login`)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Strict check for Admin routes
    if (path.startsWith('/admin') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 5. If token exists, verify it isn't empty/dummy (basic check)
    if (token && !isPublicPath) {
        // We allow them to proceed.
        return NextResponse.next()
    }

    // 6. Default allow for public paths
    return NextResponse.next()
}

// Configure paths to match
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images/assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
