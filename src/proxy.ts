import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_API_ROUTES = [
  '/api/v1/health',
  '/api/v1/ride-options',
  '/api/v1/pricing/estimate',
  '/api/v1/booking-requests',
  '/api/v1/auth/logout',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ── Protection routes booking ── */
  if (pathname.startsWith('/reserver')) {
    const response = NextResponse.next()

    const supabase = createServerClient(
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

    /* getUser() vérifie le JWT côté serveur Supabase — plus fiable que getSession() */
    const { data: { user }, error } = await supabase.auth.getUser()

    console.log('[proxy] /reserver - user:', user?.email ?? 'null', 'error:', error?.message ?? 'none')

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  /* ── Protection routes API ── */
  if (!pathname.startsWith('/api/v1')) return NextResponse.next()
  if (PUBLIC_API_ROUTES.includes(pathname))  return NextResponse.next()

  /* Logout route — toujours accessible */
  if (pathname === '/api/auth/logout') return NextResponse.next()

  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/reserver/:path*', '/reserver', '/api/v1/:path*'],
}