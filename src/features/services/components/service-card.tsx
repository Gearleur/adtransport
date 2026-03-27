'use client'

/* ============================================================
   features/services/components/service-card.tsx
   Carte individuelle d'un service B2B
   ============================================================ */

import type { ReactNode } from 'react'

interface ServiceCardProps {
  icon:        ReactNode
  tag:         string
  title:       string
  description: string
  features:    string[]
  accent:      string  // couleur d'accent CSS
}

export function ServiceCard({
  icon, tag, title, description, features, accent,
}: ServiceCardProps) {
  return (
    <>
      <style>{`
        .svc-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: border-color 250ms ease, transform 250ms ease;
          overflow: hidden;
        }
        .svc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-accent, rgba(255,255,255,0.15)), transparent);
        }
        .svc-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }
        .svc-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.55);
        }
        .svc-feature:last-child { border-bottom: none; }
        .svc-feature-dot {
          width: 4px; height: 4px; border-radius: 9999px; flex-shrink: 0;
        }
      `}</style>

      <div
        className="svc-card"
        style={{ '--card-accent': accent } as React.CSSProperties}
      >
        {/* Lueur d'accent en haut à gauche */}
        <div style={{
          position: 'absolute', top: -40, left: -40,
          width: 120, height: 120, borderRadius: 9999,
          background: accent,
          opacity: 0.06, filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* Tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 11, fontWeight: 500,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginBottom: 24, width: 'fit-content',
        }}>
          {tag}
        </div>

        {/* Icône */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, color: accent, flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Titre */}
        <h3 style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 22,
          color: '#ffffff', lineHeight: 1.2,
          letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.7, marginBottom: 28,
        }}>
          {description}
        </p>

        {/* Features */}
        <div style={{ marginTop: 'auto' }}>
          {features.map(f => (
            <div key={f} className="svc-feature">
              <div
                className="svc-feature-dot"
                style={{ background: accent, opacity: 0.8 }}
              />
              {f}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}