import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/* ============================================================
   AD Transport — Logo
   DA : premium sombre, typographie serrée, minimalisme
   ============================================================ */

interface LogoProps {
  className?: string
  markOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const sizes = {
  sm: { mark: 28, textSize: 13, gap: 7 },
  md: { mark: 34, textSize: 15, gap: 9 },
  lg: { mark: 46, textSize: 20, gap: 12 },
}

export function Logo({ className, markOnly = false, size = 'md', href = '/' }: LogoProps) {
  const s = sizes[size]

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
    <div
      className={cn('inline-flex items-center select-none', className)}
      style={{ gap: s.gap }}
      aria-label="AD Transport"
    >
      <BrandMark size={s.mark} />

      {!markOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: s.textSize,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>
            Transport
          </span>
        </div>
      )}
    </div>
    </Link>
  )
}

export function BrandMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* Fond carré arrondi — blanc cassé premium */}
      <rect width="36" height="36" rx="9" fill="#f0ece6" />

      {/* "AD" typographié dans le carré */}
      <text
        x="18" y="25"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="-0.5"
        fill="#0d0f18"
      >
        AD
      </text>
    </svg>
  )
}