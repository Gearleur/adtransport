import Link from 'next/link'
import { MapPin, Navigation } from 'lucide-react'

/* ============================================================
   LocationInputs
   Les deux champs pickup / destination
   Réutilisables sur mobile ET desktop
   ============================================================ */

interface LocationInputsProps {
  size?: 'sm' | 'md'
}

export function LocationInputs({ size = 'md' }: LocationInputsProps) {
  const height = size === 'sm' ? 48 : 54
  const fontSize = size === 'sm' ? 13 : 14
  const radius = size === 'sm' ? 12 : 14

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LocationInput
        icon={<MapPin size={14} strokeWidth={2} />}
        placeholder="Pickup Location"
        href="/reserver?step=pickup"
        height={height}
        fontSize={fontSize}
        radius={radius}
      />
      <LocationInput
        icon={<Navigation size={14} strokeWidth={2} />}
        placeholder="Destination"
        href="/reserver?step=destination"
        height={height}
        fontSize={fontSize}
        radius={radius}
      />
    </div>
  )
}

/* ── Input individuel ── */
function LocationInput({
  icon, placeholder, href, height, fontSize, radius,
}: {
  icon: React.ReactNode
  placeholder: string
  href: string
  height: number
  fontSize: number
  radius: number
}) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      height, padding: '0 16px', borderRadius: radius,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      color: 'rgba(255,255,255,0.38)',
      fontSize,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      textDecoration: 'none',
      transition: 'all 150ms ease',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, display: 'flex' }}>
        {icon}
      </span>
      <span>{placeholder}</span>
    </Link>
  )
}