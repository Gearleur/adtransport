'use client'

/* ============================================================
   features/bookings/components/home-page-mobile.tsx
   ============================================================ */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { RideCard } from './ride-card'
import { DateRail } from './date-rail'
import type { RideCardData } from './ride-card'

interface HomePageMobileProps {
  rides: RideCardData[]
}

export function HomePageMobile({ rides }: HomePageMobileProps) {
  /* Date sélectionnée — null = toutes */
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  /* Toutes les dates des courses */
  const allDates = rides
    .map(r => r.scheduledAt ? new Date(r.scheduledAt).toISOString().split('T')[0] : null)
    .filter(Boolean) as string[]

  /* Filtrer les courses par date sélectionnée */
  const filteredRides = selectedDate
    ? rides.filter(r => {
        if (!r.scheduledAt) return false
        return new Date(r.scheduledAt).toISOString().split('T')[0] === selectedDate
      })
    : rides

  /* Tri : upcoming first */
  const sorted = [...filteredRides].sort((a, b) => {
    const order = { in_progress: 0, upcoming: 1, completed: 2, cancelled: 3 }
    return order[a.status] - order[b.status]
  })

  const upcoming  = sorted.filter(r => r.status === 'upcoming' || r.status === 'in_progress')
  const past      = sorted.filter(r => r.status === 'completed' || r.status === 'cancelled')

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
      }}>
        <Logo size="md" />
        <AuthButton />
      </div>

      {/* Titre + CTA */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 26,
              color: '#ffffff', letterSpacing: '-0.02em',
              lineHeight: 1.1, marginBottom: 4,
            }}>
              Mes courses
            </h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.35)',
            }}>
              {rides.length} course{rides.length > 1 ? 's' : ''}
            </p>
          </div>

          <Link href="/reserver" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 9999,
            background: '#ffffff', color: '#07090f',
            textDecoration: 'none', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.30)',
          }}>
            <Plus size={20} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Layout : date rail + cards */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

          {/* Rail de dates */}
          {allDates.length > 0 && (
            <DateRail
              dates={allDates}
              selectedDate={selectedDate}
              onSelect={d => setSelectedDate(d === selectedDate ? null : d)}
            />
          )}

          {/* Cards */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>

            {rides.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {upcoming.length > 0 && (
                  <Section label="À venir" rides={upcoming} />
                )}
                {past.length > 0 && (
                  <Section label="Historique" rides={past} />
                )}
                {sorted.length === 0 && (
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, color: 'rgba(255,255,255,0.30)',
                    textAlign: 'center', padding: '32px 0',
                  }}>
                    Aucune course ce jour
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ label, rides }: { label: string; rides: RideCardData[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.30)',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        marginBottom: 10,
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rides.map(r => <RideCard key={r.id} ride={r} />)}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '48px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        🚗
      </div>
      <p style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700, fontSize: 16, color: '#ffffff',
      }}>
        Aucune course
      </p>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
      }}>
        Réservez votre première course<br />pour qu’elle apparaisse ici.
      </p>
      <Link href="/reserver" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', borderRadius: 9999,
        background: '#ffffff', color: '#07090f',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontWeight: 600, fontSize: 13, textDecoration: 'none',
        marginTop: 4,
      }}>
        <Plus size={14} strokeWidth={2.5} />
        Réserver une course
      </Link>
    </div>
  )
}