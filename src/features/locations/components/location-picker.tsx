'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttons'
import { MapComponent } from './map-component'
import type { Location } from '../types/location.types'

/* ============================================================
   features/locations/components/location-picker.tsx

   Overlay plein écran pour choisir un emplacement sur la carte.
   Gère les deux layouts :
   - Mobile  : carte plein écran + panel bas
   - Desktop : panel gauche + carte droite

   Usage :
   <LocationPicker
     field="pickup"
     onConfirm={(loc) => setPickup(loc)}
     onCancel={() => setPickMode(null)}
   />
   ============================================================ */

interface LocationPickerProps {
  /** Quel champ on est en train de remplir */
  field: 'pickup' | 'destination'
  /** Appelé quand l'utilisateur confirme */
  onConfirm: (location: Location) => void
  /** Appelé quand l'utilisateur annule */
  onCancel: () => void
}

export function LocationPicker({ field, onConfirm, onCancel }: LocationPickerProps) {
  const [pickedLocation, setPickedLocation] = useState<Location | null>(null)

  const label = field === 'pickup' ? 'Lieu de prise en charge' : 'Destination'

  function handleLocationPicked(_field: 'pickup' | 'destination', location: Location) {
    setPickedLocation(location)
  }

  function handleConfirm() {
    if (!pickedLocation) return
    onConfirm(pickedLocation)
  }

  return (
    <>
      <style>{`
        .picker-mobile  { display: flex; }
        .picker-desktop { display: none; }

        @media (min-width: 1024px) {
          .picker-mobile  { display: none; }
          .picker-desktop { display: grid; }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="picker-mobile" style={{
        position: 'fixed', inset: 0, zIndex: 500,
        flexDirection: 'column',
        background: '#07090f',
      }}>
        {/* Carte — tout l'écran sauf le panel bas */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 220 }}>
          <MapComponent
            style={{ width: '100%', height: '100%' }}
            pickMode={field}
            onLocationPicked={handleLocationPicked}
          />
        </div>

        {/* Bouton retour flottant */}
        <button onClick={onCancel} style={{
          position: 'absolute',
          top: 'max(16px, env(safe-area-inset-top, 16px))',
          left: 16,
          zIndex: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: 999,
          background: 'rgba(7,9,15,0.80)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#ffffff', cursor: 'pointer',
        }}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>

        {/* Panel bas */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 600,
          background: '#0d1117',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px 20px 0 0',
          padding: '16px 20px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 16px))',
        }}>
          {/* Handle */}
          <div style={{
            width: 36, height: 4, borderRadius: 999,
            background: 'rgba(255,255,255,0.12)',
            margin: '0 auto 16px',
          }} />

          {/* Label */}
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {label}
          </p>

          {/* Adresse */}
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 15, fontWeight: 500,
            color: pickedLocation ? '#ffffff' : 'rgba(255,255,255,0.28)',
            marginBottom: 18, minHeight: 24,
            letterSpacing: '-0.01em',
          }}>
            {pickedLocation?.label ?? 'Déplacez la carte pour positionner…'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <BtnPrimary fullWidth size="lg" disabled={!pickedLocation} onClick={handleConfirm}>
              Confirmer cet emplacement
            </BtnPrimary>
            <BtnSecondary fullWidth size="md" onClick={onCancel}>
              Annuler
            </BtnSecondary>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="picker-desktop" style={{
        position: 'fixed', inset: 0, zIndex: 500,
        gridTemplateColumns: '2fr 5fr',
        background: '#07090f',
        padding: '16px 16px 16px 0',
      }}>

        {/* Panel gauche */}
        <div style={{
          background: '#07090f',
          display: 'flex', flexDirection: 'column',
          padding: '44px 40px 36px',
          height: '100%', overflowY: 'auto',
        }}>

          {/* Bouton retour */}
          <div style={{ marginBottom: 32 }}>
            <button onClick={onCancel} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.80)', cursor: 'pointer',
            }}>
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Titre */}
          <h2 style={{
            fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontStyle: 'normal',
            fontSize: 'clamp(1.75rem, 2vw, 2.25rem)',
            color: '#ffffff', lineHeight: 1.1,
            letterSpacing: '-0.01em', marginBottom: 8,
          }}>
            {field === 'pickup' ? 'Lieu de départ' : 'Destination'}
          </h2>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.40)',
            lineHeight: 1.6, marginBottom: 40,
          }}>
            Déplacez la carte pour positionner le point exactement.
          </p>

          {/* Label */}
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {label}
          </p>

          {/* Adresse sélectionnée */}
          <div style={{
            minHeight: 54,
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${pickedLocation ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 14,
            marginBottom: 'auto',
            transition: 'border-color 200ms ease',
          }}>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14, fontWeight: 500,
              color: pickedLocation ? '#ffffff' : 'rgba(255,255,255,0.25)',
              letterSpacing: '-0.01em',
            }}>
              {pickedLocation?.label ?? 'Déplacez la carte…'}
            </p>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 32 }}>
            <BtnPrimary fullWidth size="lg" disabled={!pickedLocation} onClick={handleConfirm}>
              Confirmer cet emplacement
            </BtnPrimary>
            <BtnSecondary fullWidth size="md" onClick={onCancel}>
              Annuler
            </BtnSecondary>
          </div>

        </div>

        {/* Carte droite */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 20,
        }}>
          <MapComponent
            style={{ width: '100%', height: '100%' }}
            pickMode={field}
            onLocationPicked={handleLocationPicked}
          />
          {/* Fondu gauche */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 64,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, #07090f, transparent)',
          }} />
        </div>

      </div>
    </>
  )
}