import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Define protected routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Note: Full role verification should ideally happen here by decoding the token.
        // However, without 'jose' or 'jsonwebtoken' compatibility in Edge, 
        // strict role validation is often offloaded to the page or layout unless using a specialized library.
        // For now, we trust the token presence (Auth Guard) and the API will enforce role permissions eventually.
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/admin/:path*',
}
