import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://yprwuzewpvrchljpylih.supabase.co data:; connect-src 'self' https://yprwuzewpvrchljpylih.supabase.co wss://yprwuzewpvrchljpylih.supabase.co;"
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add code between createServerClient and supabase.auth.getUser()
  // A common mistake is to run other code here, which may cause session issues.
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/verify-email', '/forgot-password', '/reset', '/error']
  const isPublic = publicRoutes.includes(pathname)

  // 1. Unauthenticated users trying to access protected pages → go to login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated users on login/signup → redirect to dashboard based on role
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/admin-tasks', request.url))
    } else {
      return NextResponse.redirect(new URL('/user/user-dashboard', request.url))
    }
  }

  // 3. Protect admin routes – only allow admin role
  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/user/user-dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Ignore static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)).*)',
  ],
}
