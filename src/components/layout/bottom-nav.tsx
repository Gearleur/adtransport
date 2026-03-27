'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, User } from 'lucide-react'
import { useNavLinks } from '@/hooks/use-nav-links'

export function BottomNav() {
  const pathname = usePathname()
  const nav      = useNavLinks()

  const isHome    = pathname === '/home'
  const isProfile = pathname.startsWith('/profil')
  const isNew     = pathname.startsWith('/reserver')

  return (
    <>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: max(24px, env(safe-area-inset-bottom, 20px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0;
          height: 68px;
          padding: 0 16px;
          border-radius: 9999px;
          width: calc(100vw - 48px);
          max-width: 360px;

          /* Glass effect bien visible */
          background: rgba(13, 17, 23, 0.55);
          backdrop-filter: blur(32px) saturate(1.8) brightness(1.1);
          -webkit-backdrop-filter: blur(32px) saturate(1.8) brightness(1.1);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow:
            0 8px 40px rgba(0,0,0,0.50),
            0 2px 10px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(255,255,255,0.04);
        }
        .nav-btn {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; flex: 1; height: 50px;
          border-radius: 9999px;
          text-decoration: none;
          color: rgba(255,255,255,0.40);
          transition: color 150ms ease, background 150ms ease;
          position: relative;
        }
        .nav-btn:hover { color: rgba(255,255,255,0.70); }
        .nav-btn.active { color: #ffffff; }
        .nav-btn.active::after {
          content: '';
          position: absolute; bottom: -2px;
          left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 9999px; background: #ffffff;
        }
        .nav-label {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.02em;
        }
        .nav-plus-wrap {
          position: relative; display: flex;
          align-items: center; justify-content: center;
          width: 58px; height: 58px;
          margin: 0 8px;
          transform: translateY(-10px);
          flex-shrink: 0;
        }
        .nav-plus {
          display: flex; align-items: center; justify-content: center;
          width: 58px; height: 58px; border-radius: 9999px;
          background: #ffffff; color: #07090f;
          text-decoration: none;
          transition: transform 150ms ease, box-shadow 150ms ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.20);
        }
        .nav-plus:hover { transform: scale(1.06); }
        .nav-plus:active { transform: scale(0.96); }
        .nav-plus.active { background: #07090f; color: #ffffff; border: 1.5px solid rgba(255,255,255,0.15); }
      `}</style>

      <nav className="bottom-nav">
        <Link href={nav.home} className={`nav-btn${isHome ? ' active' : ''}`}>
          <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} />
          <span className="nav-label">Accueil</span>
        </Link>

        <div className="nav-plus-wrap">
          <Link href={nav.booking} className={`nav-plus${isNew ? ' active' : ''}`}>
            <Plus size={26} strokeWidth={2} />
          </Link>
        </div>

        <Link href={nav.profile} className={`nav-btn${isProfile ? ' active' : ''}`}>
          <User size={20} strokeWidth={isProfile ? 2.5 : 1.8} />
          <span className="nav-label">Profil</span>
        </Link>
      </nav>
    </>
  )
}