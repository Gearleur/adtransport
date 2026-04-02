'use client'

/* ============================================================
   features/driver/components/ride-action-card.tsx
   Carte de course avec swipe pour changer de statut
   ============================================================ */

import { useRef, useState } from 'react'
import { MapPin, User, Phone, Clock, ChevronRight } from 'lucide-react'
import { RouteBadge } from '@/components/ui/route-badge'
import type { DriverRide } from '../../services/driver.service'

interface RideActionCardProps {
  ride:          DriverRide
  onStartRide:   (ride: DriverRide) => void   // accepted → demande prix
  onFinishRide:  (ride: DriverRide) => void   // in_progress → completed
}

const SWIPE_THRESHOLD = 80   // px pour déclencher l'action
const SWIPE_MAX      = 140  // px max de déplacement

function formatTime(iso: string | null) {
  if (!iso) return 'Maintenant'
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function RideActionCard({ ride, onStartRide, onFinishRide }: RideActionCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const startX     = useRef(0)
  const currentX   = useRef(0)
  const [offset,   setOffset]   = useState(0)
  const [swiping,  setSwiping]  = useState(false)
  const [fired,    setFired]    = useState(false)

  const isAccepted    = ride.status === 'accepted'
  const isInProgress  = ride.status === 'in_progress'

  const actionLabel = isAccepted ? 'Démarrer' : 'Terminer'
  const actionColor = isAccepted ? '#60a5fa'  : '#4ade80'

  function onTouchStart(e: React.TouchEvent) {
    if (fired) return
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!swiping || fired) return
    const dx = e.touches[0].clientX - startX.current
    currentX.current = dx
    if (dx < 0) { setOffset(0); return }
    setOffset(Math.min(dx, SWIPE_MAX))
  }

  function onTouchEnd() {
    if (!swiping || fired) return
    setSwiping(false)

    if (currentX.current >= SWIPE_THRESHOLD) {
      /* Seuil atteint → action */
      setOffset(SWIPE_MAX)
      setFired(true)
      setTimeout(() => {
        if (isAccepted)   onStartRide(ride)
        if (isInProgress) onFinishRide(ride)
        setOffset(0)
        setFired(false)
      }, 300)
    } else {
      setOffset(0)
    }
    currentX.current = 0
  }

  const progress = Math.min(offset / SWIPE_THRESHOLD, 1)

  return (
    <>
      <style>{`
        .rac-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          touch-action: pan-y;
          user-select: none;
        }
        /* Fond révélé par le swipe */
        .rac-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; padding: 0 24px;
          border-radius: 18px;
        }
        /* Carte principale */
        .rac-card {
          position: relative;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          will-change: transform;
          z-index: 1;
        }
      `}</style>

      <div className="rac-wrap">
        {/* Fond swipe */}
        <div
          className="rac-bg"
          style={{
            background: `linear-gradient(90deg, ${actionColor}20, ${actionColor}35)`,
            opacity: progress,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ChevronRight size={20} color={actionColor} strokeWidth={2.5} style={{ opacity: 0.5 + progress * 0.5 }} />
            <ChevronRight size={20} color={actionColor} strokeWidth={2.5} style={{ opacity: 0.2 + progress * 0.5, marginLeft: -12 }} />
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, fontWeight: 700, color: actionColor,
              opacity: progress,
            }}>
              {actionLabel}
            </span>
          </div>
        </div>

        {/* Carte */}
        <div
          ref={cardRef}
          className="rac-card"
          style={{
            transform: `translateX(${offset}px)`,
            transition: swiping ? 'none' : 'transform 300ms cubic-bezier(0.22,1,0.36,1)',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Barre statut */}
          <div style={{
            height: 3,
            background: actionColor,
            opacity: 0.7,
            borderRadius: '18px 18px 0 0',
          }} />

          <div style={{ padding: '14px 16px' }}>

            {/* Heure + Durée (centre) + Statut */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={11} color="rgba(255,255,255,0.30)" strokeWidth={2} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: 'rgba(255,255,255,0.45)',
                }}>
                  {formatTime(ride.scheduled_at)}
                </span>
              </div>
              {ride.duration_min != null && (
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 11, fontWeight: 600, color: '#ffffff',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 9999, padding: '3px 9px',
                  whiteSpace: 'nowrap',
                }}>
                  {ride.duration_min >= 60
                    ? `${Math.floor(ride.duration_min / 60)}h${String(ride.duration_min % 60).padStart(2,'0')}`
                    : `${ride.duration_min} min`}
                </span>
              )}
              {ride.duration_min == null && <span />}
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, fontWeight: 600, color: actionColor,
                letterSpacing: '0.04em', textAlign: 'right',
              }}>
                {isAccepted ? 'Acceptée' : 'En cours'}
              </span>
            </div>

            {/* Trajet */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)', marginBottom: 3,
                }}>Départ</p>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700, fontSize: 14, color: '#ffffff', lineHeight: 1.2,
                }}>
                  {ride.pickup_address.split(',')[0]}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                {ride.distance_km != null && (
                  <span style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.50)',
                    whiteSpace: 'nowrap',
                  }}>
                    {ride.distance_km} km
                  </span>
                )}
                <div style={{
                  width: 26, height: 26, borderRadius: 9999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 5h8M6 3l2 2-2 2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)', marginBottom: 3,
                }}>Arrivée</p>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700, fontSize: 14, color: '#ffffff', lineHeight: 1.2,
                }}>
                  {ride.dropoff_address.split(',')[0]}
                </p>
              </div>
            </div>

            {/* Client + Prix */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <User size={11} color="rgba(255,255,255,0.25)" strokeWidth={2} />
                  <span style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 12, color: 'rgba(255,255,255,0.45)',
                  }}>
                    {ride.passenger_name || '—'}
                  </span>
                </div>
                {ride.passenger_phone && (
                  <a href={`tel:${ride.passenger_phone ?? ""}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <Phone size={13} color="#60a5fa" strokeWidth={2} />
                  </a>
                )}
              </div>

              {ride.driver_price != null && (
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 800, fontSize: 16, color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}>
                  {ride.driver_price}€
                </span>
              )}
            </div>

            {/* Hint swipe */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 4, marginTop: 10, opacity: 0.35,
            }}>
              <ChevronRight size={12} color="rgba(255,255,255,0.5)" />
              <ChevronRight size={12} color="rgba(255,255,255,0.5)" style={{ marginLeft: -6 }} />
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 10, color: 'rgba(255,255,255,0.40)',
              }}>
                Glisser pour {actionLabel.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}