'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Check } from 'lucide-react'
import type { DriverRide } from '../../services/driver.service'

interface PriceConfirmSheetProps {
  ride:      DriverRide | null
  onConfirm: (rideId: string, price: number) => Promise<void>
  onClose:   () => void
}

function formatDuration(min: number) {
  if (min >= 60) return `${Math.floor(min / 60)}h${String(min % 60).padStart(2,'0')}`
  return `${min} min`
}

export function PriceConfirmSheet({ ride, onConfirm, onClose }: PriceConfirmSheetProps) {
  const [price,   setPrice]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    const next = ride?.driver_price ? String(ride.driver_price) : ''
    setTimeout(() => { setPrice(next); setError(null) }, 0)
  }, [ride])

  if (!ride) return null

  async function handleConfirm() {
    const p = parseFloat(price)
    if (!price || isNaN(p) || p <= 0) { setError('Entrez un prix valide'); return }
    setLoading(true)
    setError(null)
    await onConfirm(ride!.id, p)
    setLoading(false)
    onClose()
  }

  return (
    <>
      <style>{`
        .pcs-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.70);
          backdrop-filter: blur(4px);
          display: flex; align-items: flex-end;
          animation: pcs-fade 200ms ease;
        }
        .pcs-sheet {
          width: 100%; max-width: 480px;
          background: linear-gradient(160deg, #1e2130 0%, #131520 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-bottom: none;
          border-radius: 24px 24px 0 0;
          padding: 0 20px max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px));
          animation: pcs-slide 300ms cubic-bezier(0.22,1,0.36,1);
        }
        .pcs-input {
          width: 100%; height: 64px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.14);
          border-radius: 16px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 28px; font-weight: 800;
          color: #ffffff; text-align: center;
          outline: none; box-sizing: border-box;
          letter-spacing: -0.03em;
          transition: border-color 150ms ease;
        }
        .pcs-input:focus { border-color: rgba(255,255,255,0.35); }
        .pcs-input::placeholder { color: rgba(255,255,255,0.20); font-size: 20px; font-weight: 500; }
        .pcs-confirm {
          width: 100%; height: 56px;
          border-radius: 14px; border: none; cursor: pointer;
          background: #ffffff; color: #07090f;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 150ms ease;
        }
        .pcs-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes pcs-fade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcs-slide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pcs-spin  { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pcs-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div className="pcs-sheet">

          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 700, fontSize: 18, color: '#ffffff',
              letterSpacing: '-0.02em',
            }}>
              Confirmer le prix
            </p>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.50)',
            }}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Durée en gros sous le titre */}
          {ride.duration_min != null && (
            <p style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 28, color: '#ffffff',
              letterSpacing: '-0.03em', marginBottom: 20,
            }}>
              {formatDuration(ride.duration_min)}
              {ride.distance_km != null && (
                <span style={{
                  fontSize: 16, fontWeight: 500,
                  color: 'rgba(255,255,255,0.40)',
                  marginLeft: 10, letterSpacing: '-0.01em',
                }}>
                </span>
              )}
            </p>
          )}

          {/* Résumé trajet + distance à droite */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '12px 14px', marginBottom: 20,
            display: 'grid', gridTemplateColumns: '1fr auto',
            alignItems: 'center', gap: 12,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={12} color="#60a5fa" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4,
                }}>
                  {ride.pickup_address.split(',').slice(0, 2).join(',')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={12} color="#4ade80" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4,
                }}>
                  {ride.dropoff_address.split(',').slice(0, 2).join(',')}
                </span>
              </div>
            </div>

            {/* Distance à droite */}
            {ride.distance_km != null && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10, flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 800, fontSize: 18, color: '#ffffff',
                  letterSpacing: '-0.02em', lineHeight: 1,
                }}>
                  {ride.distance_km}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2,
                }}>
                  km
                </span>
              </div>
            )}
          </div>

          {/* Saisie prix */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              className="pcs-input"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={price}
              onChange={e => { setPrice(e.target.value); setError(null) }}
              autoFocus
            />
            {price && (
              <span style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
              }}>€</span>
            )}
          </div>

          {error && (
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12, color: '#f87171',
              textAlign: 'center', marginBottom: 8,
            }}>
              {error}
            </p>
          )}

          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.25)',
            textAlign: 'center', marginBottom: 16,
          }}>
            Le client sera notifié du prix final
          </p>

          <button className="pcs-confirm" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <div style={{ width: 16, height: 16, borderRadius: 9999, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#07090f', animation: 'pcs-spin 0.8s linear infinite' }} />
            ) : (
              <Check size={16} strokeWidth={2.5} />
            )}
            {loading ? 'Démarrage...' : `Démarrer à ${price || '—'}€`}
          </button>
        </div>
        </div>
      </div>
    </>
  )
}