'use client'

/* ============================================================
   features/driver/components/nav/driver-top-nav.tsx
   ============================================================ */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Zap, LogOut } from 'lucide-react'
import { Logo } from '@/components/branding/logo'

const NAV_ITEMS = [
  { href: '/conducteur',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/conducteur/activite', label: 'Activité',  icon: Zap             },
]

export function DriverTopNav() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <>
      <style>{`
        .drv-top {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          height: 60px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 40px;
          background: rgba(10, 11, 18, 0.90);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .drv-top-link {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9999px; text-decoration: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.40); transition: all 150ms ease;
        }
        .drv-top-link:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.05); }
        .drv-top-link.active { color: #ffffff; background: rgba(255,255,255,0.07); }
        .drv-top-link.active.zap { color: #4ade80; background: rgba(74,222,128,0.08); }
      `}</style>

      <header className="drv-top">
        {/* Logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size="md" href="/conducteur" />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 9999,
            background: 'rgba(74,222,128,0.10)',
            border: '1px solid rgba(74,222,128,0.20)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 10, fontWeight: 700,
            color: '#4ade80', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: '#4ade80' }} />
            Conducteur
          </span>
        </div>

        {/* Liens */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            const isZap    = href.includes('activite')
            return (
              <Link
                key={href}
                href={href}
                className={`drv-top-link${isActive ? ` active${isZap ? ' zap' : ''}` : ''}`}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 9999, cursor: 'pointer',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.15)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, fontWeight: 500, color: 'rgba(248,113,113,0.70)',
            transition: 'all 150ms ease',
          }}
        >
          <LogOut size={14} strokeWidth={1.8} />
          Déconnexion
        </button>
      </header>
    </>
  )
}