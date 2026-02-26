import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  res.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://yprwuzewpvrchljpylih.supabase.co data:; connect-src 'self' https://yprwuzewpvrchljpylih.supabase.co wss://yprwuzewpvrchljpylih.supabase.co;"
);
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options, maxAge: undefined }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options, maxAge: undefined }) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/verify-email', '/forgot-password', '/reset', '/error']
  const isPublic = publicRoutes.includes(pathname)

  // 1. Unauthenticated users trying to access protected pages then go to login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated users on login/signup can go to dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/admin-tasks', request.url))
    } else {
      return NextResponse.redirect(new URL('/user/user-dashboard', request.url))
    }
  }

  // 3. Protect admin routes
  if (pathname.startsWith('/admin') && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/user/user-dashboard', request.url))
    }
  }

  return res
}



// middleware.ts
export const config = {
  matcher: [
    // This regex tells the middleware to IGNORE static files like mp4
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)).*)',
  ],
};
  
