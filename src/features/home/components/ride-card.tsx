'use client'

import { formatRideDate } from '../utils/ride.utils'

export type RideStatus = 'pending' | 'upcoming' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export interface RideCardData {
  id:           string
  status:       RideStatus
  pickupLabel:  string
  pickupCity:   string
  dropoffLabel: string
  dropoffCity:  string
  scheduledAt:    string | null
  price:          number | null
  passengerName:  string | null
  distanceKm:     number | null
  durationMin:    number | null
}

const STATUS: Record<RideStatus, { label: string; glow: string; text: string; bar: string }> = {
  pending:     { label: 'En attente de validation', glow: '#fbbf24', text: '#fcd34d', bar: 'linear-gradient(90deg,#92400e,#fbbf24,#fcd34d,#fbbf24,#92400e)' },
  upcoming:    { label: 'Confirmée',                glow: '#60a5fa', text: '#93c5fd', bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa,#bfdbfe,#60a5fa,#1d4ed8)' },
  accepted:    { label: 'Confirmée',                glow: '#60a5fa', text: '#93c5fd', bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa,#bfdbfe,#60a5fa,#1d4ed8)' },
  in_progress: { label: 'En cours',                glow: '#4ade80', text: '#86efac', bar: 'linear-gradient(90deg,#166534,#4ade80,#bbf7d0,#4ade80,#166534)' },
  completed:   { label: 'Terminée',                glow: '#6b7280', text: '#9ca3af', bar: 'linear-gradient(90deg,#374151,#6b7280,#9ca3af,#6b7280,#374151)' },
  cancelled:   { label: 'Annulée',                 glow: '#f87171', text: '#fca5a5', bar: 'linear-gradient(90deg,#991b1b,#f87171,#fecaca,#f87171,#991b1b)' },
}

function shortAddress(full: string): string {
  const parts = full.split(',').map(p => p.trim())
  if (parts.length > 1 && /^\d+$/.test(parts[0])) {
    return `${parts[0]} ${parts[1]}`
  }
  return parts[0] ?? full
}

function cityFromAddress(full: string): string | null {
  const parts = full.split(',').map(p => p.trim())
  /* Format Nominatim: "5 Rue X, 75000, Paris, France"
     ou "Lieu, 75000, Paris, France" */
  // Cherche un segment qui ressemble à une ville (pas un code postal, pas "France")
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i]
    if (/^\d{4,5}$/.test(p)) continue  // code postal
    if (p.toLowerCase() === 'france') continue
    if (p.length < 2) continue
    return p
  }
  return null
}

export function RideCard({ ride }: { ride: RideCardData }) {
  const s       = STATUS[ride.status]
  const date    = formatRideDate(ride.scheduledAt)
  const dim     = ride.status === 'completed' || ride.status === 'cancelled'
  const pickup  = shortAddress(ride.pickupLabel)
  const dropoff = shortAddress(ride.dropoffLabel)

  const shortDate = ride.scheduledAt
    ? new Date(ride.scheduledAt).toLocaleDateString('fr-FR', {
        weekday: 'short', day: 'numeric', month: 'long',
      })
    : null

  return (
    <>
      <style>{`
        .rc-wrap {
          display: flex; flex-direction: column;
          filter:
            drop-shadow(0 2px 0 rgba(255,255,255,0.04))
            drop-shadow(0 8px 20px rgba(0,0,0,0.50))
            drop-shadow(0 24px 48px rgba(0,0,0,0.55));
          transition: transform 250ms ease, filter 250ms ease;
        }
        .rc-wrap:hover {
          transform: translateY(-4px) rotate(0.3deg);
          filter:
            drop-shadow(0 2px 0 rgba(255,255,255,0.06))
            drop-shadow(0 14px 28px rgba(0,0,0,0.60))
            drop-shadow(0 32px 56px rgba(0,0,0,0.65));
        }
        .rc-body {
          border-radius: 16px 16px 0 0;
          border: 1px solid rgba(255,255,255,0.12);
          border-bottom: none;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(125deg,
              rgba(255,255,255,0.09) 0%,
              rgba(255,255,255,0.03) 30%,
              rgba(255,255,255,0.07) 55%,
              rgba(255,255,255,0.02) 70%,
              rgba(255,255,255,0.06) 100%
            ),
            linear-gradient(160deg, #1e2130 0%, #131520 100%);
        }
        .rc-body::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 50px;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
          pointer-events: none; z-index: 0;
        }
        .rc-stub {
          border-radius: 0 0 16px 16px;
          border: 1px solid rgba(255,255,255,0.08);
          border-top: none;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(125deg,
              rgba(255,255,255,0.05) 0%,
              rgba(255,255,255,0.01) 50%,
              rgba(255,255,255,0.04) 100%
            ),
            linear-gradient(160deg, #131520 0%, #0c0e18 100%);
        }
        .rc-stub::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,
            transparent 0%, rgba(255,255,255,0.025) 50%, transparent 100%
          );
          pointer-events: none;
        }
        @keyframes rc-blink   { 0%,100%{opacity:1}50%{opacity:.15} }
        @keyframes rc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>

      <div className="rc-wrap" style={{ opacity: dim ? 0.45 : 1 }}>

        {/* ── Corps ── */}
        <div className="rc-body">

          {/* Barre shimmer colorée très lente */}
          <div style={{
            height: 3,
            background: s.bar,
            backgroundSize: '300% 100%',
            animation: dim ? 'none' : 'rc-shimmer 18s linear infinite',
          }} />

          <div style={{ padding: '16px 20px 18px', position: 'relative', zIndex: 1 }}>

            {/* Date + Durée + Heure */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center', marginBottom: 18,
            }}>
              {/* Date */}
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, fontWeight: 500,
                color: 'rgba(255,255,255,0.40)',
                textTransform: 'capitalize', letterSpacing: '0.01em',
              }}>
                {shortDate ?? 'Maintenant'}
              </span>

              {/* Durée — centre */}
              {ride.durationMin != null && (
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 11, fontWeight: 600,
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 9999, padding: '3px 9px',
                  whiteSpace: 'nowrap',
                }}>
                  {ride.durationMin >= 60
                    ? `${Math.floor(ride.durationMin / 60)}h${String(ride.durationMin % 60).padStart(2,'0')}`
                    : `${ride.durationMin} min`}
                </span>
              )}
              {ride.durationMin == null && <span />}

              {/* Heure */}
              {date.timeLabel !== 'Maintenant' && (
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 14, fontWeight: 800,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '-0.02em',
                  textAlign: 'right',
                }}>
                  {date.timeLabel}
                </span>
              )}
              {date.timeLabel === 'Maintenant' && <span />}
            </div>

            {/* Trajet */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center', gap: 10,
            }}>
              <div>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)',
                  marginBottom: 5,
                }}>Départ</p>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 800, fontSize: 16, letterSpacing: '-0.025em',
                  color: '#ffffff', lineHeight: 1.1,
                }}>{pickup}</p>
                {cityFromAddress(ride.pickupLabel) && (
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 11, color: 'rgba(255,255,255,0.35)',
                    marginTop: 3,
                  }}>{cityFromAddress(ride.pickupLabel)}</p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 14, height: 1, background: 'rgba(255,255,255,0.14)' }} />
                <div style={{
                  width: 22, height: 22, borderRadius: 9999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 4.5h7M5.5 2.5l2 2-2 2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ width: 14, height: 1, background: 'rgba(255,255,255,0.14)' }} />
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)',
                  marginBottom: 5,
                }}>Arrivée</p>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 800, fontSize: 16, letterSpacing: '-0.025em',
                  color: '#ffffff', lineHeight: 1.1,
                }}>{dropoff}</p>
                {cityFromAddress(ride.dropoffLabel) && (
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 11, color: 'rgba(255,255,255,0.35)',
                    marginTop: 3, textAlign: 'right',
                  }}>{cityFromAddress(ride.dropoffLabel)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Perforation ── */}
        <div style={{
          position: 'relative',
          height: 16,
          background: `
            linear-gradient(125deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%),
            linear-gradient(160deg, #191c28 0%, #111320 100%)
          `,
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none', borderBottom: 'none',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            position: 'absolute', left: -9, top: '50%', transform: 'translateY(-50%)',
            width: 18, height: 18, borderRadius: 9999,
            background: '#07090f',
            boxShadow: 'inset 3px 0 5px rgba(0,0,0,0.6)',
          }} />
          <div style={{
            flex: 1, margin: '0 6px', height: 1,
            background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 5px, transparent 5px, transparent 12px)',
          }} />
          <div style={{
            position: 'absolute', right: -9, top: '50%', transform: 'translateY(-50%)',
            width: 18, height: 18, borderRadius: 9999,
            background: '#07090f',
            boxShadow: 'inset -3px 0 5px rgba(0,0,0,0.6)',
          }} />
        </div>

        {/* ── Talon prix ── */}
        <div className="rc-stub">
          <div style={{
            padding: '13px 20px 15px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 1,
          }}>
            {/* Passager */}
            <div>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
                marginBottom: 3,
              }}>Passager</p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 600, fontSize: 13,
                color: 'rgba(255,255,255,0.70)',
              }}>
                {ride.passengerName ?? '—'}
              </p>
            </div>

            {/* Prix */}
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
                marginBottom: 3,
              }}>Total</p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em',
                color: '#ffffff',
                textShadow: '0 1px 6px rgba(255,255,255,0.10)',
              }}>
                {ride.price != null && ride.price >= 0 ? `${ride.price} €` : 'Sur devis'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}