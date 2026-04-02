'use client'

/* ============================================================
   features/driver/components/pending-ride-card.tsx
   Carte course en attente — avec saisie prix + accepter/refuser
   ============================================================ */

import { useState } from 'react'
import { MapPin, Clock, User, Phone, FileText, Check, X } from 'lucide-react'
import type { DriverRide } from '../../services/driver.service'

interface PendingRideCardProps {
  ride:     DriverRide
  onAccept: (rideId: string, price: number | null) => Promise<string | null | undefined>
  onDecline:(rideId: string) => Promise<string | null | undefined>
}

function formatDate(iso: string | null) {
  if (!iso) return 'Dès que possible'
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit',
  })
}

export function PendingRideCard({ ride, onAccept, onDecline }: PendingRideCardProps) {
  const [price,     setPrice]     = useState('')
  const [loading,   setLoading]   = useState<'accept' | 'decline' | null>(null)
  const [error,     setError]     = useState<string | null>(null)
  const [expanded,  setExpanded]  = useState(false)

  async function handleAccept() {
    /* Prix optionnel — champ vide = sur devis (null) */
    const trimmed = price.trim()
    let p: number | null = null

    if (trimmed !== '') {
      p = parseFloat(trimmed)
      if (isNaN(p) || p < 0) {
        setError('Prix invalide')
        return
      }
    }

    setLoading('accept')
    setError(null)
    const err = await onAccept(ride.id, p)
    if (err) setError(err)
    setLoading(null)
  }

  async function handleDecline() {
    setLoading('decline')
    await onDecline(ride.id)
    setLoading(null)
  }

  return (
    <>
      <style>{`
        .prc {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px; overflow: hidden;
          transition: border-color 150ms ease;
        }
        .prc-price-input {
          flex: 1; height: 44px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 0 12px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 16px; font-weight: 700; color: #ffffff;
          outline: none; box-sizing: border-box;
        }
        .prc-price-input:focus { border-color: rgba(255,255,255,0.30); }
        .prc-price-input::placeholder { color: rgba(255,255,255,0.25); font-weight: 400; font-size: 14px; }
        .prc-btn-accept {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          flex: 1; height: 44px; border-radius: 10px; border: none; cursor: pointer;
          background: #ffffff; color: #07090f;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 700;
          transition: all 150ms ease;
        }
        .prc-btn-accept:hover { background: rgba(255,255,255,0.88); }
        .prc-btn-accept:disabled { opacity: 0.5; cursor: not-allowed; }
        .prc-btn-decline {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 10px; border: none; cursor: pointer;
          background: rgba(248,113,113,0.10);
          border: 1px solid rgba(248,113,113,0.20);
          color: #f87171;
          transition: all 150ms ease; flex-shrink: 0;
        }
        .prc-btn-decline:hover { background: rgba(248,113,113,0.18); }
        .prc-btn-decline:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes prc-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="prc">

        {/* Header — clic pour expand */}
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ padding: '14px 16px', cursor: 'pointer' }}
        >
          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Clock size={12} color="rgba(255,255,255,0.30)" strokeWidth={2} />
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12, color: 'rgba(255,255,255,0.45)',
            }}>
              {formatDate(ride.scheduled_at)}
            </span>
          </div>

          {/* Trajet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
            <div>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 3,
              }}>Départ</p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 14, color: '#ffffff', lineHeight: 1.2,
              }}>
                {ride.pickup_address.split(',')[0]}
              </p>
            </div>

            <div style={{
              width: 28, height: 28, borderRadius: 9999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8M6 3l2 2-2 2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 3,
              }}>Arrivée</p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 14, color: '#ffffff', lineHeight: 1.2,
              }}>
                {ride.dropoff_address.split(',')[0]}
              </p>
            </div>
          </div>

          {/* Expand hint */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginTop: 10,
          }}>
            <div style={{
              width: 24, height: 3, borderRadius: 9999,
              background: 'rgba(255,255,255,0.12)',
            }} />
          </div>
        </div>

        {/* Détails expandables */}
        {expanded && (
          <div style={{
            padding: '0 16px 14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 14,
          }}>
            {/* Infos client */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={13} color="rgba(255,255,255,0.30)" strokeWidth={1.8} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, color: 'rgba(255,255,255,0.60)',
                }}>
                  {ride.passenger_name ?? ""}
                </span>
              </div>
              <a href={`tel:${ride.passenger_phone ?? ""}`} style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              }}>
                <Phone size={13} color="rgba(255,255,255,0.30)" strokeWidth={1.8} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, color: '#60a5fa',
                }}>
                  {ride.passenger_phone ?? ""}
                </span>
              </a>
              {ride.notes && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <FileText size={13} color="rgba(255,255,255,0.30)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5,
                  }}>
                    {ride.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Adresses complètes */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '10px 12px',
              marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <MapPin size={12} color="#60a5fa" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: 'rgba(255,255,255,0.50)', lineHeight: 1.4,
                }}>
                  {ride.pickup_address}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <MapPin size={12} color="#4ade80" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: 'rgba(255,255,255,0.50)', lineHeight: 1.4,
                }}>
                  {ride.dropoff_address}
                </span>
              </div>
            </div>

            {/* Saisie prix + actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  className="prc-price-input"
                  type="number"
                  inputMode="numeric"
                  placeholder="Prix (€) — optionnel"
                  value={price}
                  onChange={e => { setPrice(e.target.value); setError(null) }}
                  style={{ width: '100%' }}
                />
                {price && (
                  <span style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, color: 'rgba(255,255,255,0.40)',
                  }}>€</span>
                )}
              </div>
              <button
                className="prc-btn-accept"
                onClick={handleAccept}
                disabled={loading !== null}
              >
                {loading === 'accept' ? (
                  <div style={{ width: 14, height: 14, borderRadius: 9999, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#07090f', animation: 'prc-spin 0.8s linear infinite' }} />
                ) : (
                  <Check size={14} strokeWidth={2.5} />
                )}
                Accepter
              </button>
              <button
                className="prc-btn-decline"
                onClick={handleDecline}
                disabled={loading !== null}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {error && (
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, color: '#f87171', marginTop: 8,
              }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}