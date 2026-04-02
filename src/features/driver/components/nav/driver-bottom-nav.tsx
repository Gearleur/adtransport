'use client'

/* ============================================================
   features/driver/components/nav/driver-bottom-nav.tsx
   ============================================================ */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/conducteur',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/conducteur/activite', label: 'Activité',  icon: Zap             },
]

export function DriverBottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <>
      <style>{`
        .drv-nav {
          position: fixed;
          bottom: max(16px, env(safe-area-inset-bottom, 12px));
          left: 50%; transform: translateX(-50%);
          z-index: 1000;
          display: flex; align-items: center; gap: 4px;
          height: 60px; padding: 0 10px;
          width: calc(100vw - 40px); max-width: 300px;
          border-radius: 9999px;
          background: rgba(20, 22, 32, 0.90);
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .drv-nav-btn {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px; height: 46px; border-radius: 9999px;
          text-decoration: none;
          color: rgba(255,255,255,0.35);
          transition: color 150ms ease, background 150ms ease;
          border: none; background: none; cursor: pointer;
        }
        .drv-nav-btn:hover { color: rgba(255,255,255,0.65); }
        .drv-nav-btn.active { color: #ffffff; background: rgba(255,255,255,0.08); }
        .drv-nav-btn.active.zap { color: #4ade80; background: rgba(74,222,128,0.10); }
        .drv-nav-label {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .drv-logout-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 9999px;
          border: none; cursor: pointer; flex-shrink: 0;
          background: rgba(248,113,113,0.08);
          color: rgba(248,113,113,0.60);
          transition: all 150ms ease;
        }
        .drv-logout-btn:hover { background: rgba(248,113,113,0.15); color: #f87171; }
      `}</style>

      <nav className="drv-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          const isZap    = href.includes('activite')
          return (
            <Link
              key={href}
              href={href}
              className={`drv-nav-btn${isActive ? ` active${isZap ? ' zap' : ''}` : ''}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="drv-nav-label">{label}</span>
            </Link>
          )
        })}

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px', flexShrink: 0 }} />

        <button className="drv-logout-btn" onClick={handleLogout}>
          <LogOut size={15} strokeWidth={1.8} />
        </button>
      </nav>
    </>
  )
}