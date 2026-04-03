import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function createSupabase(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ── Protection /reserver ── */
  if (pathname.startsWith('/reserver')) {
    const response = NextResponse.next()
    const supabase = createSupabase(request, response)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  /* ── Protection /home et /profil — redirige owner vers /conducteur ── */
  if (pathname.startsWith('/home') || pathname.startsWith('/profil')) {
    const response = NextResponse.next()
    const supabase = createSupabase(request, response)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'owner') {
        return NextResponse.redirect(new URL('/conducteur', request.url))
      }
    }

    return response
  }

  /* ── Protection /conducteur — rôle owner uniquement ── */
  if (pathname.startsWith('/conducteur')) {
    const response = NextResponse.next()
    const supabase = createSupabase(request, response)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'owner') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  }

  /* ── Route logout — toujours accessible ── */
  if (pathname.startsWith('/api/v1/auth/logout')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/reserver/:path*', '/reserver',
    '/conducteur/:path*', '/conducteur',
    '/home/:path*', '/home',
    '/profil/:path*', '/profil',
    '/api/v1/auth/logout',
  ],
}