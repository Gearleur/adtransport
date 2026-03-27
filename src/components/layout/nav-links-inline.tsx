'use client'

import Link from 'next/link'
import { Home, User } from 'lucide-react'
import { useNavLinks } from '@/hooks/use-nav-links'

/* ============================================================
   components/layout/nav-links-inline.tsx

   Liens Accueil + Profil inline — utilisés dans HeroPanel
   et BookingPanel qui ont leur propre header.
   ============================================================ */

export function NavLinksInline() {
  const nav = useNavLinks()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <style>{`
        .inline-nav-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 9999px;
          text-decoration: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.40);
          transition: all 150ms ease; white-space: nowrap;
        }
        .inline-nav-link:hover {
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.06);
        }
      `}</style>

      <Link href={nav.home} className="inline-nav-link">
        <Home size={12} strokeWidth={2} />
        Accueil
      </Link>
      <Link href={nav.profile} className="inline-nav-link">
        <User size={12} strokeWidth={2} />
        Profil
      </Link>
    </nav>
  )
}