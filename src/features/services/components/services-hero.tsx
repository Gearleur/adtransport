/* ============================================================
   features/services/components/services-hero.tsx
   ============================================================ */

export function ServicesHero() {
  return (
    <section style={{
      paddingTop: 40, paddingBottom: 60,
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Lueur centrale */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Titre */}
      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        color: '#ffffff',
        lineHeight: 1.0,
        letterSpacing: '-0.03em',
        marginBottom: 24,
        maxWidth: 720,
        margin: '0 auto 24px',
      }}>
        Services<br />
        <span style={{ color: 'rgba(255,255,255,0.35)' }}>
          professionnels
        </span>
      </h1>

      {/* Sous-titre */}
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 17, color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.7, maxWidth: 540,
        margin: '0 auto',
      }}>
        Nous accompagnons les entreprises, compagnies d’assurance et établissements
        scolaires avec des services de transport fiables, disponibles 24h/24.
      </p>
    </section>
  )
}