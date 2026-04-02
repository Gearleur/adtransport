'use client'

/* ============================================================
   features/driver/components/driver-activity.tsx
   Orchestrateur — délègue à activity-mobile / activity-desktop
   ============================================================ */

import { ActivityMobile }  from './activity/activity-mobile'
import { ActivityDesktop } from './activity/activity-desktop'

export function DriverActivity() {
  return (
    <>
      <style>{`
        .drv-act-mobile  { display: block; }
        .drv-act-desktop { display: none;  }
        @media (min-width: 1024px) {
          .drv-act-mobile  { display: none;  }
          .drv-act-desktop { display: block; }
        }
      `}</style>
      <div className="drv-act-mobile"><ActivityMobile /></div>
      <div className="drv-act-desktop"><ActivityDesktop /></div>
    </>
  )
}