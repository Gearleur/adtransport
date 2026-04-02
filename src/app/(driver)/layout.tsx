'use client'

/* ============================================================
   app/(driver)/layout.tsx
   ============================================================ */

import { DriverBottomNav } from '@/features/driver/components/nav/driver-bottom-nav'
import { DriverTopNav }    from '@/features/driver/components/nav/driver-top-nav'

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .drv-mobile  { display: block; }
        .drv-desktop { display: none;  }
        @media (min-width: 1024px) {
          .drv-mobile  { display: none;  }
          .drv-desktop { display: block; }
        }
      `}</style>
      <div className="drv-desktop"><DriverTopNav /></div>
      <div className="drv-mobile"><DriverBottomNav /></div>
      {children}
    </>
  )
}