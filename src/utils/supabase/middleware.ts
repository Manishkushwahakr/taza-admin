import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 1. Protect Admin/Seller Routes
    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/admin') ||
            request.nextUrl.pathname.startsWith('/seller'))
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (!user) {
        return supabaseResponse
    }

    // Role-Based Access Control (RBAC)
    // Role-Based Access Control (RBAC)
    if (user) {
        // 1. Fetch user role
        const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single()

        const role = userRole?.role

        // 2. Protect Admin Routes
        if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/access-denied', request.url))
        }

        // 3. Protect Seller Routes
        if (request.nextUrl.pathname.startsWith('/seller') && role !== 'seller') {
            return NextResponse.redirect(new URL('/access-denied', request.url))
        }

        // 4. Redirect logged-in users away from login page
        if (request.nextUrl.pathname.startsWith('/login')) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url))
            } else if (role === 'seller') {
                return NextResponse.redirect(new URL('/seller', request.url))
            } else {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return supabaseResponse
}
