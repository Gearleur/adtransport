// api/v1/auth/logout/route.ts

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const allCookies  = cookieStore.getAll()
  const response    = NextResponse.json({ ok: true })

  /* Supabase signOut via client serveur */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => allCookies,
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.signOut()

  /* Force expiration de tous les cookies Supabase */
  allCookies.forEach(({ name }) => {
    if (name.startsWith('sb-') || name.includes('supabase')) {
      response.cookies.set(name, '', {
        maxAge: 0, path: '/', expires: new Date(0),
        httpOnly: true, sameSite: 'lax',
      })
    }
  })

  return response
}