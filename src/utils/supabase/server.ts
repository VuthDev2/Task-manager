import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient(remember = false) {
  const cookieStore = cookies();
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 days if remembered

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options, maxAge, path: '/' });
          } catch {
            // Ignore errors
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options, maxAge, path: '/' });
          } catch {
            // Ignore errors
          }
        },
      },
    }
  );
}