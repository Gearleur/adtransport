'use client'

/* ============================================================
   features/bookings/components/home-page-desktop.tsx
   ============================================================ */

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { NavLinksInline } from '@/components/layout/nav-links-inline'
import { RideCard } from './ride-card'
import type { RideCardData } from './ride-card'

interface HomePageDesktopProps {
  rides: RideCardData[]
}

export function HomePageDesktop({ rides }: HomePageDesktopProps) {
  const upcoming = rides.filter(r => r.status === 'upcoming' || r.status === 'in_progress')
  const past     = rides.filter(r => r.status === 'completed' || r.status === 'cancelled')

  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px 60px', gap: 16,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo size="md" />
        </Link>
        <NavLinksInline />
        <AuthButton />
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 60px' }}>

        {/* Titre + CTA */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 40,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 36,
              color: '#ffffff', letterSpacing: '-0.03em',
              lineHeight: 1.05, marginBottom: 6,
            }}>
              Mes courses
            </h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.35)',
            }}>
              {rides.length} course{rides.length > 1 ? 's' : ''}
            </p>
          </div>

          <Link href="/reserver" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', borderRadius: 9999,
            background: '#ffffff', color: '#07090f',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            transition: 'all 150ms ease',
          }}>
            <Plus size={16} strokeWidth={2.5} />
            Nouvelle course
          </Link>
        </div>

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
          </>
        )}

      </main>
    </div>
  )
}

function Section({ label, rides }: { label: string; rides: RideCardData[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.30)',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rides.map(r => <RideCard key={r.id} ride={r} />)}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 24, background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
      }}>
        🚗
      </div>
      <div>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 6,
        }}>
          Aucune course
        </p>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
        }}>
          Réservez votre première course pour qu’elle apparaisse ici.
        </p>
      </div>
      <Link href="/reserver" style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '12px 24px', borderRadius: 9999,
        background: '#ffffff', color: '#07090f',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontWeight: 600, fontSize: 14, textDecoration: 'none',
        marginTop: 4,
      }}>
        <Plus size={15} strokeWidth={2.5} />
        Réserver une course
      </Link>
    </div>
  )
}