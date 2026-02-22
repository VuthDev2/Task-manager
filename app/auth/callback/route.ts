import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Handle OAuth callback
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options, path: '/' })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options, path: '/' })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to dashboard based on role
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/admin/admin-dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/user/user-dashboard`)
        }
      }
      return NextResponse.redirect(`${origin}/user/user-dashboard`)
    }
  }

  if (token_hash && type) {
    // Handle email confirmation
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options, path: '/' })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options, path: '/' })
          },
        },
      }
    )
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    if (!error) {
      // Email confirmed – redirect to login with a success message (optional)
      return NextResponse.redirect(`${origin}/login?confirmed=true`)
    }
  }

  // If no valid parameters, redirect to login
  return NextResponse.redirect(`${origin}/login?error=invalid_callback`)
}