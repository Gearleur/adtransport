/* ============================================================
   features/services/components/services-cta.tsx
   ============================================================ */

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export function ServicesCta() {
  return (
    <section style={{
      position: 'relative',
      borderRadius: 28,
      border: '1px solid rgba(255,255,255,0.09)',
      background: 'rgba(255,255,255,0.03)',
      padding: 'clamp(40px, 6vw, 72px)',
      textAlign: 'center',
      marginBottom: 80,
      overflow: 'hidden',
    }}>
      {/* Fond décoratif */}
      <div style={{
        position: 'absolute', top: -100, left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 12, fontWeight: 500,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Parlons de votre projet
      </p>

      <h2 style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
        color: '#ffffff', lineHeight: 1.1,
        letterSpacing: '-0.025em',
        marginBottom: 16, maxWidth: 560, margin: '0 auto 16px',
      }}>
        Un besoin spécifique ?<br />
        <span style={{ color: 'rgba(255,255,255,0.35)' }}>On sadapte.</span>
      </h2>

      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 15, color: 'rgba(255,255,255,0.40)',
        lineHeight: 1.7, maxWidth: 440,
        margin: '0 auto 40px',
      }}>
        Devis personnalisé, contrat sur-mesure, interlocuteur dédié.
        Contactez-nous pour discuter de votre situation.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <style>{`
          .cta-primary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 14px 28px; border-radius: 9999px;
            background: #ffffff; color: #07090f;
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 14px; font-weight: 600;
            text-decoration: none;
            transition: all 150ms ease;
            box-shadow: 0 2px 12px rgba(0,0,0,0.3);
          }
          .cta-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }

          .cta-secondary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 14px 28px; border-radius: 9999px;
            background: transparent; color: rgba(255,255,255,0.70);
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 14px; font-weight: 500;
            text-decoration: none;
            border: 1px solid rgba(255,255,255,0.14);
            transition: all 150ms ease;
          }
          .cta-secondary:hover { background: rgba(255,255,255,0.06); color: #fff; }
        `}</style>

        <Link href="/contact" className="cta-primary">
          Demander un devis
          <ArrowRight size={16} strokeWidth={2} />
        </Link>

        <a href="tel:+33600000000" className="cta-secondary">
          <Phone size={15} strokeWidth={1.8} />
          Nous appeler
        </a>
      </div>
    </section>
  )
}