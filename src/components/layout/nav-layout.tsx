'use client'

import { usePathname } from 'next/navigation'
import { TopNav } from './top-nav'
import { BottomNav } from './bottom-nav'

/* Pages sans top nav desktop (elles ont leur propre header intégré) */
const NO_TOP_NAV = ['/', '/login', '/inscription', '/mot-de-passe-oublie', '/reserver', '/services']

/* Pages sans bottom nav mobile */
const NO_BOTTOM_NAV = ['/login', '/inscription', '/mot-de-passe-oublie']

export function NavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const showTopNav    = !NO_TOP_NAV.some(r => pathname === r || (r !== '/' && pathname.startsWith(r)))
  const showBottomNav = !NO_BOTTOM_NAV.some(r => pathname.startsWith(r))

  return (
    <>
      <style>{`
        .nav-mobile-show  { display: block; }
        .nav-desktop-show { display: none; }

        @media (min-width: 1024px) {
          .nav-mobile-show  { display: none; }
          .nav-desktop-show { display: block; }
        }
      `}</style>

      {/* Top nav — desktop seulement, certaines pages l'ont intégré */}
      {showTopNav && (
        <div className="nav-desktop-show">
          <TopNav />
        </div>
      )}

      {/* Bottom nav — mobile toujours (sauf auth) */}
      {showBottomNav && (
        <div className="nav-mobile-show">
          <BottomNav />
        </div>
      )}

      {children}
    </>
  )
}