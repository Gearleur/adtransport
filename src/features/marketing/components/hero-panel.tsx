import Link from 'next/link'
import { Star, Shield, Clock } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttons'
import { AuthButton } from '@/features/auth/components/auth-button'
import { NavLinksInline } from '@/components/layout/nav-links-inline'
import { LocationInputs } from './location-inputs'

export function HeroPanel() {
  return (
    <div style={{
      background: '#07090f',
      display: 'flex', flexDirection: 'column',
      padding: '44px 40px 36px',
      overflowY: 'auto', height: '100%',
    }}>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 40, gap: 12,
      }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo size="md" />
        </Link>
        <NavLinksInline />
        <AuthButton />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Headline />
        <TrustBadges />

        <div style={{ marginBottom: 14 }}>
          <LocationInputs size="md" />
        </div>

        <div style={{ marginTop: 'auto', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BtnPrimary href="/reserver" fullWidth size="lg">
            Réserver une course
          </BtnPrimary>
          <BtnSecondary href="/services" fullWidth size="lg">
            Mes services
          </BtnSecondary>
        </div>
      </div>
    </div>
  )
}

function Headline() {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 800, fontSize: 'clamp(2.2rem, 3vw, 3rem)',
        color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 14,
      }}>
        Chauffeur Privé
      </h1>
      <p style={{
        color: 'rgba(255,255,255,0.42)', fontSize: 13,
        fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.7,
      }}>
        Service de chauffeur haut de gamme disponible 24h/24 et 7j/7 à Paris,
        en Île-de-France et Hauts-de-France
      </p>
    </div>
  )
}

function TrustBadges() {
  const badges = [
    { icon: <Star size={10} />,   label: '4.9 rated' },
    { icon: <Shield size={10} />, label: 'Insured' },
    { icon: <Clock size={10} />,  label: '24/7' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
      {badges.map((b) => (
        <span key={b.label} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.45)', fontSize: 11,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          <span style={{ display: 'flex', color: 'rgba(255,255,255,0.32)' }}>{b.icon}</span>
          {b.label}
        </span>
      ))}
    </div>
  )
}