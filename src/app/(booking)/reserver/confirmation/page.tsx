'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, MapPin, Navigation, Calendar, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttons'
import { getBookingById } from '@/features/booking/services/booking.service'
import type { Booking } from '@/features/booking/types/booking.types'

/* ============================================================
   app/(booking)/reserver/confirmation/page.tsx
   ============================================================ */

export default function ConfirmationPage() {
  const searchParams          = useSearchParams()
  const router                = useRouter()
  const id                    = searchParams.get('id')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { router.push('/reserver'); return }
    getBookingById(id).then(b => {
      setBooking(b)
      setLoading(false)
    })
  }, [id, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#07090f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 999,
          border: '2px solid rgba(255,255,255,0.2)',
          borderTopColor: '#fff',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!booking) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#07090f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
          Réservation introuvable
        </p>
        <BtnSecondary href="/reserver" size="md">Nouvelle réservation</BtnSecondary>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'max(48px, env(safe-area-inset-top)) 24px max(32px, env(safe-area-inset-bottom))',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <Logo size="md" />
        </div>

        {/* Icône succès */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <CheckCircle
            size={56} strokeWidth={1.5}
            color="#22c55e"
            style={{ margin: '0 auto 16px' }}
          />
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 26,
            color: '#ffffff', letterSpacing: '-0.02em',
            marginBottom: 8,
          }}>
            Réservation confirmée
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.45)',
          }}>
            Nous avons bien reçu votre demande
          </p>
        </div>

        {/* Récapitulatif */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 16,
          marginBottom: 28,
        }}>
          {/* Départ */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(74,158,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={14} color="#4a9eff" />
            </div>
            <div>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
              }}>
                Départ
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14, fontWeight: 500, color: '#ffffff',
              }}>
                {booking.pickup_address}
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Destination */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(74,158,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Navigation size={14} color="#6b9fdd" />
            </div>
            <div>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
              }}>
                Destination
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14, fontWeight: 500, color: '#ffffff',
              }}>
                {booking.dropoff_address}
              </p>
            </div>
          </div>

          {/* Date si programmée */}
          {booking.requested_at && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={14} color="rgba(255,255,255,0.5)" />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 11, color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
                  }}>
                    Date
                  </p>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 14, fontWeight: 500, color: '#ffffff',
                  }}>
                    {new Date(booking.requested_at).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })} à {new Date(booking.requested_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BtnPrimary href="/" fullWidth size="lg">
            Retour à laccueil
          </BtnPrimary>
          <BtnSecondary href="/reserver" fullWidth size="md">
            Nouvelle réservation
          </BtnSecondary>
        </div>

      </div>
    </div>
  )
}