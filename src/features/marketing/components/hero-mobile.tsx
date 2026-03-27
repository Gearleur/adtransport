import Link from 'next/link'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttons'
import { AuthButton } from '@/features/auth/components/auth-button'
import { LocationInputs } from './location-inputs'
import { MapComponent } from '@/features/locations/components/map-component'

export function HeroMobile() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', background: '#07090f',
    }}>

      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MapComponent style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{
        position: 'absolute', inset: 0, bottom: '45%', zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(7,9,15,0.97) 0%, rgba(7,9,15,0.7) 50%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, top: '35%', zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(7,9,15,1) 0%, rgba(7,9,15,0.95) 35%, rgba(7,9,15,0.6) 60%, transparent 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '0 20px',
      }}>

        {/* Zone haute */}
        <div style={{ paddingTop: 'max(48px, env(safe-area-inset-top, 16px))' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 50,
          }}>
            <Logo size="md" />
            <AuthButton />
          </div>
          <LocationInputs size="sm" />
        </div>

        {/* Zone basse */}
        <div style={{ paddingBottom: 'max(110px, calc(env(safe-area-inset-bottom, 0px) + 100px))' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 'clamp(2.4rem, 10vw, 3.5rem)',
              color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.01em',
            }}>
              Chauffeur Privé
            </h1>
            <p style={{
              marginTop: 10, color: 'rgba(255,255,255,0.50)', fontSize: 14,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              Paris, en Île-de-France et hauts-de-France
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <BtnPrimary href="/reserver" fullWidth size="lg">
              Réserver une course
            </BtnPrimary>
            <BtnSecondary href="/services" fullWidth size="lg">
              Mes services
            </BtnSecondary>
          </div>
        </div>

      </div>
    </div>
  )
}