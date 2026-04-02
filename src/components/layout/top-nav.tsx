'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, User } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { useNavLinks } from '@/hooks/use-nav-links'

export function TopNav() {
  const pathname = usePathname()
  const nav      = useNavLinks()

  return (
    <>
      <style>{`
        .top-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          height: 60px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 32px;
          background: rgba(7,9,15,0.80);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .top-nav-links { display: flex; align-items: center; gap: 4px; }
        .top-nav-link {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9999px; text-decoration: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.45); transition: all 150ms ease;
        }
        .top-nav-link:hover { color: rgba(255,255,255,0.80); background: rgba(255,255,255,0.06); }
        .top-nav-link.active { color: #ffffff; background: rgba(255,255,255,0.09); }
        .top-nav-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 9999px; text-decoration: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 600;
          background: #ffffff; color: #07090f;
          transition: all 150ms ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20);
        }
        .top-nav-cta:hover { background: rgba(255,255,255,0.88); transform: translateY(-1px); }
        .top-nav-cta:active { transform: translateY(0); }
      `}</style>

      <header className="top-nav">
        <Logo size="md" />

        <nav className="top-nav-links">
          <Link
            href={nav.home}
            className={`top-nav-link${pathname === '/home' ? ' active' : ''}`}
          >
            <Home size={14} strokeWidth={2} />
            Accueil
          </Link>

          <Link href={nav.booking} className="top-nav-cta">
            <Plus size={15} strokeWidth={2.5} />
            Nouvelle course
          </Link>

          <Link
            href={nav.profile}
            className={`top-nav-link${pathname.startsWith('/profil') ? ' active' : ''}`}
          >
            <User size={14} strokeWidth={2} />
            Profil
          </Link>
        </nav>

        <AuthButton />
      </header>
    </>
  )
}