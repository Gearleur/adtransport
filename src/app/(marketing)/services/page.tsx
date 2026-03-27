/* ============================================================
   app/(marketing)/services/page.tsx
   ============================================================ */

import { ServicesDesktop } from '@/features/services/components/services-desktop'
import { ServicesMobile } from '@/features/services/components/services-mobile'

export default function ServicesPage() {
  return (
    <>
      <style>{`
        .svc-mobile  { display: block; }
        .svc-desktop { display: none;  }
        @media (min-width: 1024px) {
          .svc-mobile  { display: none;  }
          .svc-desktop { display: block; }
        }
      `}</style>
      <div className="svc-mobile">  <ServicesMobile /> </div>
      <div className="svc-desktop"> <ServicesDesktop /> </div>
    </>
  )
}