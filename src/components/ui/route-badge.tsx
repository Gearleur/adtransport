/* ============================================================
   Composant partagé — badge durée + distance
   ============================================================ */

interface RouteBadgeProps {
  durationMin: number | null
  distanceKm:  number | null
  style?:      React.CSSProperties
}

export function RouteBadge({ durationMin, distanceKm, style }: RouteBadgeProps) {
  if (durationMin == null && distanceKm == null) return null

  const duration = durationMin != null
    ? durationMin >= 60
      ? `${Math.floor(durationMin / 60)}h${String(durationMin % 60).padStart(2,'0')}`
      : `${durationMin} min`
    : null

  const parts = [duration, distanceKm != null ? `${distanceKm} km` : null].filter(Boolean)

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: 11, fontWeight: 600, color: '#ffffff',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 9999, padding: '3px 10px',
      whiteSpace: 'nowrap', letterSpacing: '0.01em',
      ...style,
    }}>
      {parts.join(' · ')}
    </span>
  )
}