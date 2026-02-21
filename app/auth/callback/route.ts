import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options, maxAge: undefined, path: '/' })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options, maxAge: undefined, path: '/' })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
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
    console.error('Exchange error:', error)
  }
  return NextResponse.redirect(`${origin}/login`)
}