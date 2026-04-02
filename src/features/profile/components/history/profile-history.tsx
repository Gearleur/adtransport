'use client'

/* ============================================================
   features/profile/components/history/profile-history.tsx
   Historique des courses — liste simple triée par date DESC
   ============================================================ */

import { useUserRides } from '@/features/home/hooks/use-user-rides'
import { MapPin, Clock } from 'lucide-react'
import type { RideCardData, RideStatus } from '@/features/home/components/ride-card'

const STATUS_LABEL: Record<RideStatus, string> = {
  pending:     'En attente',
  upcoming:    'À venir',
  accepted:    'Confirmée',
  in_progress: 'En cours',
  completed:   'Terminée',
  cancelled:   'Annulée',
}

const STATUS_COLOR: Record<RideStatus, string> = {
  pending:     '#fbbf24',
  upcoming:    '#60a5fa',
  accepted:    '#60a5fa',
  in_progress: '#4ade80',
  completed:   'rgba(255,255,255,0.30)',
  cancelled:   '#f87171',
}

function formatDate(iso: string | null) {
  if (!iso) return 'Maintenant'
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function shortAddr(full: string) {
  return full.split(',')[0]?.trim() ?? full
}

export function ProfileHistory() {
  const { all, isLoading } = useUserRides()

  const sorted = [...all].sort((a, b) => {
    if (!a.scheduledAt) return -1
    if (!b.scheduledAt) return 1
    return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  })

  if (isLoading) return <Skeleton />

  if (sorted.length === 0) {
    return (
      <div style={{
        padding: '32px 0', textAlign: 'center',
        border: '1px dashed rgba(255,255,255,0.10)',
        borderRadius: 14,
      }}>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13, color: 'rgba(255,255,255,0.28)', lineHeight: 1.6,
        }}>
          Aucune course pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map(r => <HistoryItem key={r.id} ride={r} />)}
    </div>
  )
}

function HistoryItem({ ride }: { ride: RideCardData }) {
  const color = STATUS_COLOR[ride.status]
  const dim   = ride.status === 'cancelled'

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      gap: 12, padding: '14px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      opacity: dim ? 0.5 : 1,
      transition: 'opacity 150ms ease',
    }}>
      {/* Infos course */}
      <div style={{ minWidth: 0 }}>
        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <Clock size={11} color="rgba(255,255,255,0.25)" strokeWidth={2} />
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.35)',
            textTransform: 'capitalize',
          }}>
            {formatDate(ride.scheduledAt)}
          </span>
        </div>

        {/* Trajet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <MapPin size={11} color="#60a5fa" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 600, fontSize: 13, color: '#ffffff',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {shortAddr(ride.pickupLabel)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <MapPin size={11} color="#4ade80" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.70)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {shortAddr(ride.dropoffLabel)}
            </span>
          </div>
        </div>
      </div>

      {/* Statut + prix */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 9px', borderRadius: 9999,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 10, fontWeight: 600, color,
          background: `${color}15`,
          border: `1px solid ${color}25`,
          whiteSpace: 'nowrap',
        }}>
          {STATUS_LABEL[ride.status]}
        </span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 15, color: '#ffffff',
          letterSpacing: '-0.02em',
        }}>
          {ride.price != null ? `${ride.price} €` : '—'}
        </span>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.5 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 80, borderRadius: 14,
          background: 'rgba(255,255,255,0.05)',
          animation: 'sk-pulse 1.8s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes sk-pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
    </div>
  )
}