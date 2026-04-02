'use client'

/* ============================================================
   features/driver/components/dashboard/history-row.tsx
   ============================================================ */

import type { DriverRide, DriverRideStatus } from '../../services/driver.service'

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

export function HistoryRow({ ride }: { ride: DriverRide }) {
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