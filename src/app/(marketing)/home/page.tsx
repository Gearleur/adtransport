'use client'

/* ============================================================
   app/(marketing)/home/page.tsx
   ============================================================ */

import { useEffect, useState } from 'react'
import { HomePageMobile } from '@/features/home/components/home-page-mobile'
import { HomePageDesktop } from '@/features/home/components/home-page-desktop'
import { getBookingsByEmail } from '@/features/booking/services/booking.service'
import { useAuth } from '@/features/auth/context/auth-context'
import type { RideCardData } from '@/features/home/components/ride-card'
import type { Booking } from '@/features/booking/types/booking.types'

function toRideCard(b: Booking): RideCardData {
  return {
    id:           b.id,
    status:       b.status as RideCardData['status'],
    pickupLabel:  b.pickup_address,
    pickupCity:   b.pickup_address.split(',')[0] ?? b.pickup_address,
    dropoffLabel: b.dropoff_address,
    dropoffCity:  b.dropoff_address.split(',')[0] ?? b.dropoff_address,
    scheduledAt:  b.requested_at,
    price:        b.total_estimated_price,
  }
}

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [rides, setRides]   = useState<RideCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading || !user) return
    getBookingsByEmail(user.email).then(bookings => {
      setRides(bookings.map(toRideCard))
      setLoading(false)
    })
  }, [user, isLoading])

  if (loading || isLoading) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#07090f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 9999,
          border: '2px solid rgba(255,255,255,0.15)',
          borderTopColor: '#fff',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .home-mobile  { display: block; }
        .home-desktop { display: none;  }
        @media (min-width: 1024px) {
          .home-mobile  { display: none;  }
          .home-desktop { display: block; }
        }
      `}</style>
      <div className="home-mobile">
        <HomePageMobile rides={rides} />
      </div>
      <div className="home-desktop">
        <HomePageDesktop rides={rides} />
      </div>
    </>
  )
}