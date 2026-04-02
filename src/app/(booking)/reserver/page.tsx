'use client'

import { useState, useEffect } from 'react'
import { BookingMobile } from '@/features/booking/components/booking-mobile'
import { BookingPanel }  from '@/features/booking/components/booking-panel'
import { MapComponent }  from '@/features/locations/components/map-component'

export default function ReserverPage() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <>
      <style>{`
        .booking-mobile  { display: block; }
        .booking-desktop { display: none; }
        @media (min-width: 1024px) {
          .booking-mobile  { display: none; }
          .booking-desktop {
            display: grid;
            grid-template-columns: 2fr 5fr;
            height: 100dvh; overflow: hidden;
            background: #07090f;
            padding: 16px 16px 16px 0;
          }
        }
      `}</style>

      <div className="booking-mobile">
        <BookingMobile />
      </div>

      <div className="booking-desktop">
        <BookingPanel />
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
          {isDesktop && <MapComponent style={{ width: '100%', height: '100%' }} />}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 64, pointerEvents: 'none', background: 'linear-gradient(to right, #07090f, transparent)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, pointerEvents: 'none', background: 'linear-gradient(to bottom, #07090f, transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, pointerEvents: 'none', background: 'linear-gradient(to top, #07090f, transparent)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 48, pointerEvents: 'none', background: 'linear-gradient(to left, #07090f, transparent)' }} />
        </div>
      </div>
    </>
  )
}