'use client'

/* ============================================================
   features/bookings/components/ride-card.tsx
   Carte billet de course — style boarding pass
   ============================================================ */

import { MapPin, Navigation, Clock, ChevronRight } from 'lucide-react'

export type RideStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled'

export interface RideCardData {
  id:            string
  status:        RideStatus
  pickupLabel:   string
  pickupCity:    string
  dropoffLabel:  string
  dropoffCity:   string
  scheduledAt:   string | null  // ISO string
  vehicleType?:  string
  price?:        number | null
}

const STATUS_CONFIG: Record<RideStatus, { label: string; color: string; bg: string }> = {
  upcoming:    { label: 'À venir',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  in_progress: { label: 'En cours',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  completed:   { label: 'Terminée',   color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.06)' },
  cancelled:   { label: 'Annulée',    color: '#f87171', bg: 'rgba(248,113,113,0.10)' },
}

function formatDate(iso: string | null) {
  if (!iso) return { day: '--', month: '', time: 'Maintenant' }
  const d = new Date(iso)
  return {
    day:   d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
    month: d.toLocaleDateString('fr-FR', { month: 'long' }),
    time:  d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function RideCard({ ride }: { ride: RideCardData }) {
  const status = STATUS_CONFIG[ride.status]
  const date   = formatDate(ride.scheduledAt)

  return (
    <>
      <style>{`
        .ride-card {
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 200ms ease, transform 200ms ease;
          width: 100%;
        }
        .ride-card:hover {
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }

        /* Ligne de séparation pointillée style boarding pass */
        .ride-card-divider {
          position: relative;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 20px;
        }
        .ride-card-divider::before,
        .ride-card-divider::after {
          content: '';
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px;
          border-radius: 9999px;
          background: #07090f;
          border: 1px solid rgba(255,255,255,0.09);
        }
        .ride-card-divider::before { left: -27px; }
        .ride-card-divider::after  { right: -27px; }
      `}</style>

      <div className="ride-card">

        {/* Barre de statut en haut */}
        <div style={{
          height: 3,
          background: status.color,
          opacity: ride.status === 'completed' ? 0.3 : 0.7,
        }} />

        {/* Section principale */}
        <div style={{ padding: '18px 20px 14px' }}>

          {/* Header : statut + date */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 16,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 9999,
              background: status.bg, color: status.color,
              fontSize: 11, fontWeight: 600,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: '0.03em',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: 9999,
                background: status.color, flexShrink: 0,
                animation: ride.status === 'in_progress' ? 'pulse 1.5s infinite' : 'none',
              }} />
              {status.label}
            </span>

            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12, color: 'rgba(255,255,255,0.35)',
            }}>
              {ride.scheduledAt ? date.day + ' · ' + date.time : 'Immédiat'}
            </span>
          </div>

          {/* Trajet — style boarding pass */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* Départ */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3,
              }}>
                <MapPin size={11} color="rgba(255,255,255,0.35)" strokeWidth={2} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10, color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Départ
                </span>
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 16,
                color: '#ffffff', letterSpacing: '-0.02em',
                lineHeight: 1.1, marginBottom: 2,
              }}>
                {truncate(ride.pickupCity, 12)}
              </div>
              <div style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, color: 'rgba(255,255,255,0.35)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {truncate(ride.pickupLabel, 22)}
              </div>
            </div>

            {/* Flèche centrale */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.20)' }} />
                <div style={{
                  width: 28, height: 28, borderRadius: 9999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Navigation size={12} color="rgba(255,255,255,0.60)" strokeWidth={2} />
                </div>
                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.20)' }} />
              </div>
              {ride.vehicleType && (
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, color: 'rgba(255,255,255,0.25)',
                  marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {ride.vehicleType}
                </span>
              )}
            </div>

            {/* Arrivée */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                justifyContent: 'flex-end', marginBottom: 3,
              }}>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10, color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Arrivée
                </span>
                <Navigation size={11} color="rgba(255,255,255,0.35)" strokeWidth={2} />
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 16,
                color: '#ffffff', letterSpacing: '-0.02em',
                lineHeight: 1.1, marginBottom: 2,
              }}>
                {truncate(ride.dropoffCity, 12)}
              </div>
              <div style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, color: 'rgba(255,255,255,0.35)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {truncate(ride.dropoffLabel, 22)}
              </div>
            </div>
          </div>
        </div>

        {/* Divider style boarding pass */}
        <div className="ride-card-divider" />

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 12, color: 'rgba(255,255,255,0.30)',
          }}>
            {date.month && `${date.month} ${new Date(ride.scheduledAt!).getFullYear()}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {ride.price != null && (
              <span style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 15, color: '#ffffff',
                letterSpacing: '-0.02em',
              }}>
                {ride.price}€
              </span>
            )}
            <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
          </div>
        </div>

      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}