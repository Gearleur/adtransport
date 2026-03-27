export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .auth-mobile  { display: flex; }
        .auth-desktop { display: none; }
        @media (min-width: 1024px) {
          .auth-mobile  { display: none; }
          .auth-desktop { display: grid; }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="auth-mobile" style={{
        minHeight: '100dvh',
        background: '#07090f',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'max(40px, env(safe-area-inset-top)) 24px max(32px, env(safe-area-inset-bottom))',
      }}>
        {children}
      </div>

      {/* ── DESKTOP : formulaire gauche + carte droite ── */}
      <div className="auth-desktop" style={{
        gridTemplateColumns: '2fr 5fr',
        height: '100dvh',
        overflow: 'hidden',
        background: '#07090f',
        padding: '16px 16px 16px 0',
      }}>

        {/* Panel gauche — formulaire aligné en haut */}
        <div style={{
          background: '#07090f',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '48px 48px',
          overflowY: 'auto',
        }}>
          {children}
        </div>

        {/* Fond décoratif droit */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          background: 'radial-gradient(ellipse at 60% 45%, #0f1e38 0%, #091526 40%, #07090f 100%)',
        }}>
          {/* Voile noir */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(7,9,15,0.55)',
          }} />

          {/* Grille SVG décorative */}
          <svg style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', opacity: 0.08,
          }} preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="auth-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4a7ab5" strokeWidth="0.6"/>
              </pattern>
              <pattern id="auth-grid-major" width="180" height="180" patternUnits="userSpaceOnUse">
                <path d="M 180 0 L 0 0 0 180" fill="none" stroke="#5a8fc8" strokeWidth="1.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
            <rect width="100%" height="100%" fill="url(#auth-grid-major)" />
            <line x1="-10%" y1="110%" x2="70%" y2="-10%" stroke="#5a8fc8" strokeWidth="1.5" opacity="0.5"/>
            <line x1="20%" y1="110%" x2="110%" y2="10%" stroke="#4a7ab5" strokeWidth="1" opacity="0.3"/>
          </svg>

          {/* Fondu gauche — raccord */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 100,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, #07090f, transparent)',
          }} />

          {/* Texte centré */}
          <div style={{
            position: 'relative', zIndex: 1,
            height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 60px',
          }}>
            <div style={{ textAlign: 'center', maxWidth: 420 }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: 16,
              }}>
                Votre chauffeur privé,<br />disponible 24h/24
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 15,
                color: 'rgba(255,255,255,0.40)',
                lineHeight: 1.65,
              }}>
                Paris, Île-de-France et Hauts-de-France
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}