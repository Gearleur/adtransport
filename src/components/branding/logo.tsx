import { cn } from '@/lib/utils/cn'

/* ============================================================
   VTC — Logo & Brand Mark
   Rendu 100% CSS — pas d'image requise
   ============================================================ */

interface LogoProps {
  className?: string
  /** Afficher uniquement le symbole (sans "TC") */
  markOnly?: boolean
  /** Taille en px — contrôle tout proportionnellement */
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { text: 'text-lg',    mark: 16 },
  md: { text: 'text-2xl',   mark: 22 },
  lg: { text: 'text-4xl',   mark: 32 },
}

/* ────────────────────────────────────────────
   Logo complet : "VTC"
   Le "V" est un chevron SVG stylisé
   ──────────────────────────────────────────── */
export function Logo({ className, markOnly = false, size = 'md' }: LogoProps) {
  const s = sizes[size]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 font-display font-extrabold tracking-vtc-tight text-white select-none',
        s.text,
        className
      )}
      aria-label="VTC"
    >
      {/* Symbole V stylisé */}
      <BrandMark size={s.mark} />

      {/* "TC" — masqué si markOnly */}
      {!markOnly && (
        <span className="leading-none">TC</span>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Brand Mark : le "V" seul (pour favicon, avatar...)
   ──────────────────────────────────────────── */
interface BrandMarkProps {
  size?: number
  className?: string
}

export function BrandMark({ size = 22, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/*
        V géométrique :
        - Deux diagonales qui se rejoignent en bas
        - Épaisseur variable (plus épais en haut, effilé en pointe)
        - Légère inclinaison pour donner du mouvement
      */}
      <path
        d="M3 4L9.5 18.5C10.2 20.1 11 20.8 12 20.8C13 20.8 13.8 20.1 14.5 18.5L21 4"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent — petit trait horizontal haut gauche */}
      <path
        d="M3 4H7.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}