'use client'

/* ============================================================
   app/(app)/profil/page.tsx
   ============================================================ */

import { ProfileMobile }  from '@/features/profile/components/profile-mobile'
import { ProfileDesktop } from '@/features/profile/components/profile-desktop'

export default function ProfilPage() {
  return (
    <>
      <style>{`
        .profile-mobile  { display: block; }
        .profile-desktop { display: none;  }
        @media (min-width: 1024px) {
          .profile-mobile  { display: none;  }
          .profile-desktop { display: block; }
        }
      `}</style>
      <div className="profile-mobile">
        <ProfileMobile />
      </div>
      <div className="profile-desktop">
        <ProfileDesktop />
      </div>
    </>
  )
}