'use client'

/* ============================================================
   features/driver/components/driver-mobile.tsx
   ============================================================ */

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { PendingRideCard } from './pending-ride-card'
import { DriverCalendar } from './driver-calendar'
import { useDriverRides } from '../../hooks/use-driver-rides'

type Tab = 'pending' | 'calendar'

export function DriverMobile() {
  const { pending, myRides, isLoading, error, accept, decline, changeStatus, refetch } = useDriverRides()
  const [tab, setTab] = useState<Tab>('pending')

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      paddingTop: 'max(20px, env(safe-area-inset-top, 16px))', paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>



      <div style={{ padding: '20px 20px 0' }}>

        {/* Titre */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 24, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
          }}>
            Tableau de bord
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.30)',
          }}>
            {pending.length > 0
              ? `${pending.length} course${pending.length > 1 ? 's' : ''} en attente`
              : 'Aucune course en attente'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {([
            { key: 'pending',  label: 'En attente',   count: pending.length },
            { key: 'calendar', label: 'Mes courses',  count: myRides.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length },
          ] as { key: Tab; label: string; count: number }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, fontWeight: 500,
                background: tab === t.key ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: tab === t.key ? '#07090f' : 'rgba(255,255,255,0.50)',
                transition: 'all 150ms ease',
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9999,
                  background: tab === t.key ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)',
                  color: tab === t.key ? '#07090f' : 'rgba(255,255,255,0.50)',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {error && (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: '#f87171', marginBottom: 16,
          }}>
            {error}
          </p>
        )}

        {tab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.length === 0 ? (
              <div style={{ paddingTop: 40, textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 14, color: 'rgba(255,255,255,0.25)',
                }}>
                  Aucune course en attente
                </p>
              </div>
            ) : (
              pending.map(r => (
                <PendingRideCard
                  key={r.id}
                  ride={r}
                  onAccept={accept}
                  onDecline={decline}
                />
              ))
            )}
          </div>
        )}

        {tab === 'calendar' && (
          <DriverCalendar
            rides={myRides}
            onStatusChange={changeStatus}
          />
        )}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}