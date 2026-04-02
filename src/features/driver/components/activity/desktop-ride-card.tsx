'use client'

/* ============================================================
   features/driver/components/activity/desktop-ride-card.tsx
   Carte course desktop avec boutons d'action
   ============================================================ */

import { MapPin, Phone, Clock, ChevronRight, CheckCircle2, PlayCircle } from 'lucide-react'
import type { DriverRide } from '../../services/driver.service'

interface DesktopRideCardProps {
  ride:     DriverRide
  onStart:  (ride: DriverRide) => void
  onFinish: (rideId: string)   => void
  isActing: boolean
}

function formatTime(iso: string | null) {
  if (!iso) return 'Maintenant'
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string | null) {
  if (!iso) return 'Maintenant'
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export function DesktopRideCard({ ride, onStart, onFinish, isActing }: DesktopRideCardProps) {
  const isAccepted   = ride.status === 'accepted'
  const isInProgress = ride.status === 'in_progress'
  const accentColor  = isInProgress ? '#4ade80' : '#60a5fa'

  return (
    <>
      <style>{`
        @keyframes drv-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes drv-blink   { 0%,100%{opacity:1} 50%{opacity:.2} }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accentColor}22`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 18, overflow: 'hidden',
      }}>
        {/* Barre shimmer */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, ${accentColor}40, ${accentColor}90, ${accentColor}40)`,
          backgroundSize: '300% 100%',
          animation: 'drv-shimmer 6s linear infinite',
        }} />

        <div style={{ padding: '20px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 9999,
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, fontWeight: 700, color: accentColor,
                letterSpacing: '0.04em',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: 9999, background: accentColor,
                  animation: isInProgress ? 'drv-blink 1.5s ease infinite' : 'none',
                }} />
                {isInProgress ? 'En cours' : 'Acceptée'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} color="rgba(255,255,255,0.25)" strokeWidth={2} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, color: 'rgba(255,255,255,0.40)',
                }}>
                  {formatDate(ride.scheduled_at)} · {formatTime(ride.scheduled_at)}
                </span>
              </div>
            </div>

            {ride.driver_price != null ? (
              <span style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 800, fontSize: 22, color: '#ffffff',
                letterSpacing: '-0.03em',
              }}>
                {ride.driver_price === 0 ? 'Gratuit' : `${ride.driver_price} €`}
              </span>
            ) : (
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.30)', fontStyle: 'italic',
              }}>
                Sur devis
              </span>
            )}
          </div>

          {/* Trajet */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: 16, marginBottom: 20,
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <MapPin size={12} color="#60a5fa" strokeWidth={2} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                }}>Départ</span>
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 16, color: '#ffffff', lineHeight: 1.2,
              }}>
                {ride.pickup_address.split(',')[0]}
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2,
              }}>
                {ride.pickup_address.split(',').slice(1, 2).join(',').trim()}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.10)' }} />
              <div style={{
                width: 30, height: 30, borderRadius: 9999,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChevronRight size={14} color="rgba(255,255,255,0.40)" strokeWidth={2} />
              </div>
              <div style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.10)' }} />
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                }}>Arrivée</span>
                <MapPin size={12} color="#4ade80" strokeWidth={2} />
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 16, color: '#ffffff', lineHeight: 1.2,
              }}>
                {ride.dropoff_address.split(',')[0]}
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2,
              }}>
                {ride.dropoff_address.split(',').slice(1, 2).join(',').trim()}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.60)',
              }}>
                {(ride.passenger_name ?? 'P')[0].toUpperCase()}
              </div>
              <div>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, fontWeight: 500, color: '#ffffff',
                }}>
                  {ride.passenger_name ?? 'Passager'}
                </p>
                {ride.passenger_phone && (
                  <a href={`tel:${ride.passenger_phone}`} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 12, color: '#60a5fa',
                  }}>
                    <Phone size={11} strokeWidth={2} />
                    {ride.passenger_phone}
                  </a>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {isAccepted && (
                <button
                  onClick={() => onStart(ride)}
                  disabled={isActing}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: '#60a5fa', color: '#07090f',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, fontWeight: 700,
                    opacity: isActing ? 0.6 : 1,
                    transition: 'all 150ms ease',
                  }}
                >
                  <PlayCircle size={16} strokeWidth={2.5} />
                  Démarrer la course
                </button>
              )}
              {isInProgress && (
                <button
                  onClick={() => onFinish(ride.id)}
                  disabled={isActing}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: '#4ade80', color: '#07090f',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, fontWeight: 700,
                    opacity: isActing ? 0.6 : 1,
                    transition: 'all 150ms ease',
                  }}
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  Terminer la course
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}