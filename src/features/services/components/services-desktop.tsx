'use client'

/* ============================================================
   features/services/components/services-desktop.tsx
   ============================================================ */

import Link from 'next/link'
import { ArrowLeft, Phone } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { ServicesHero } from './services-hero'
import { ServicesGrid } from './services-grid'
import { ServicesCta } from './services-cta'

export function ServicesDesktop() {
  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>

      <header style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 60px', gap: 16,
      }}>
        {/* Gauche : flèche + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.80)', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>
          <Logo size="md" />
        </div>

        {/* Centre : téléphone avec icône */}
        <a href="tel:+33608702683" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14, fontWeight: 500,
          color: 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
          transition: 'all 150ms ease',
        }}>
          <Phone size={14} strokeWidth={1.8} color="#4ade80" />
          06 08 70 26 83
        </a>

        {/* Droite : auth */}
        <AuthButton />
      </header>

      <main style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 60px',
      }}>
        <ServicesHero />
        <ServicesGrid />
        <ServicesCta />
      </main>

    </div>
  )
}