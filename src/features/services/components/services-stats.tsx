/* ============================================================
   features/services/components/services-stats.tsx
   ============================================================ */

const STATS = [
  { value: '24h',  label: 'Disponibilité', sub: 'tous les jours de l\'année' },
  { value: '15\'', label: 'Temps de réponse', sub: 'en moyenne pour les urgences' },
  { value: '4.9',  label: 'Note client', sub: 'sur plus de 500 avis' },
  { value: '100%', label: 'Assurés', sub: 'véhicules et passagers couverts' },
]

export function ServicesStats() {
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 0',
      marginBottom: 80,
    }}>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div className="stats-grid">
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff', lineHeight: 1,
              letterSpacing: '-0.03em', marginBottom: 8,
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 600, fontSize: 13,
              color: 'rgba(255,255,255,0.70)',
              marginBottom: 4,
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12, color: 'rgba(255,255,255,0.30)',
            }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}