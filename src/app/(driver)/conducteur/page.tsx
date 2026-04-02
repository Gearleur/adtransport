'use client'

/* ============================================================
   app/(driver)/conducteur/page.tsx
   ============================================================ */

import { DriverMobile }  from '@/features/driver/components/dashboard/driver-mobile'
import { DriverDesktop } from '@/features/driver/components/dashboard/driver-desktop'

export default function ConducteurPage() {
  return (
    <>
      <style>{`
        .driver-mobile  { display: block; }
        .driver-desktop { display: none;  }
        @media (min-width: 1024px) {
          .driver-mobile  { display: none;  }
          .driver-desktop { display: block; }
        }
      `}</style>
      <div className="driver-mobile">
        <DriverMobile />
      </div>
      <div className="driver-desktop">
        <DriverDesktop />
      </div>
    </>
  )
}