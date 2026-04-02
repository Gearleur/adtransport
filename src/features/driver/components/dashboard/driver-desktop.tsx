'use client'

/* ============================================================
   features/driver/components/driver-desktop.tsx
   ============================================================ */

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PendingRideCard } from './pending-ride-card'
import { DriverCalendar } from './driver-calendar'
import { useDriverRides } from '../../hooks/use-driver-rides'
import type { DriverRide, DriverRideStatus } from '../../services/driver.service'

type Tab = 'pending' | 'history' | 'all'

const TABS: { key: Tab; label: string }[] = [
  { key: 'pending', label: 'En attente'  },
  { key: 'all',     label: 'Toutes'      },
  { key: 'history', label: 'Historique'  },
]

const STATUS_LABEL: Record<DriverRideStatus, string> = {
  pending:     'En attente',
  accepted:    'Acceptée',
  in_progress: 'En cours',
  completed:   'Terminée',
  cancelled:   'Annulée',
}

const STATUS_COLOR: Record<DriverRideStatus, string> = {
  pending:     '#fbbf24',
  accepted:    '#60a5fa',
  in_progress: '#4ade80',
  completed:   'rgba(255,255,255,0.25)',
  cancelled:   '#f87171',
}

function formatDate(iso: string | null) {
  if (!iso) return 'Maintenant'
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

function HistoryRow({ ride }: { ride: DriverRide }) {
  const color = STATUS_COLOR[ride.status]
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr auto auto',
      alignItems: 'center', gap: 16,
      padding: '14px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
    }}>
      {/* Trajet */}
      <div>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 11, color: 'rgba(255,255,255,0.28)',
          marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Trajet</p>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 13, color: '#ffffff',
        }}>
          {ride.pickup_address.split(',')[0]} → {ride.dropoff_address.split(',')[0]}
        </p>
      </div>

      {/* Date */}
      <div>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 11, color: 'rgba(255,255,255,0.28)',
          marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Date</p>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13, color: 'rgba(255,255,255,0.60)',
          textTransform: 'capitalize',
        }}>
          {formatDate(ride.scheduled_at)}
        </p>
      </div>

      {/* Prix */}
      <div style={{ textAlign: 'right' }}>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 11, color: 'rgba(255,255,255,0.28)',
          marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Prix</p>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 14, color: '#ffffff',
        }}>
          {ride.driver_price != null ? `${ride.driver_price} €` : 'Sur devis'}
        </p>
      </div>

      {/* Statut */}
      <span style={{
        display: 'inline-block',
        padding: '3px 10px', borderRadius: 9999,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600, color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        whiteSpace: 'nowrap',
      }}>
        {STATUS_LABEL[ride.status]}
      </span>
    </div>
  )
}

export function DriverDesktop() {
  const { pending, myRides, isLoading, error, accept, decline, changeStatus, refetch } = useDriverRides()
  const [tab, setTab] = useState<Tab>('pending')

  const activeRides   = myRides.filter(r => r.status !== 'completed' && r.status !== 'cancelled')
  const historyRides  = myRides.filter(r => r.status === 'completed' || r.status === 'cancelled')
    .sort((a, b) => new Date(b.scheduled_at ?? b.scheduled_at ?? '').getTime() - new Date(a.scheduled_at ?? '').getTime())

  const leftRides = tab === 'pending' ? pending
    : tab === 'history' ? historyRides
    : myRides

  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '108px 60px 60px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 36, color: '#ffffff',
              letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 6,
            }}>
              Tableau de bord
            </h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.30)',
            }}>
              {pending.length > 0
                ? `${pending.length} course${pending.length > 1 ? 's' : ''} en attente`
                : 'Aucune course en attente'}
            </p>
          </div>
          <button
            onClick={refetch}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)',
              transition: 'all 150ms ease',
            }}
          >
            <RefreshCw size={14} strokeWidth={2} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            Actualiser
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, fontWeight: 500,
                background: tab === t.key ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: tab === t.key ? '#07090f' : 'rgba(255,255,255,0.50)',
                transition: 'all 150ms ease',
              }}
            >
              {t.label}
              {t.key === 'pending' && pending.length > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9999, padding: '0 4px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  background: tab === 'pending' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)',
                  color: tab === 'pending' ? '#07090f' : 'rgba(255,255,255,0.50)',
                }}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: '#f87171', marginBottom: 20,
          }}>
            {error}
          </p>
        )}

        {/* Layout 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'flex-start' }}>

          {/* Colonne gauche */}
          <div>
            {tab === 'pending' && (
              <>
                {pending.length === 0 ? (
                  <EmptyBox label="Aucune course en attente" />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pending.map(r => (
                      <PendingRideCard key={r.id} ride={r} onAccept={accept} onDecline={decline} />
                    ))}
                  </div>
                )}
              </>
            )}

            {(tab === 'history' || tab === 'all') && (
              <>
                {leftRides.length === 0 ? (
                  <EmptyBox label="Aucune course" />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {leftRides.map(r => (
                      <HistoryRow key={r.id} ride={r} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Colonne droite : calendrier */}
          <div style={{ position: 'sticky', top: 88 }}>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Calendrier — {activeRides.length} course{activeRides.length !== 1 ? 's' : ''}
            </p>
            <DriverCalendar rides={myRides} onStatusChange={changeStatus} />
          </div>

        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 18,
    }}>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 14, color: 'rgba(255,255,255,0.25)',
      }}>
        {label}
      </p>
    </div>
  )
}