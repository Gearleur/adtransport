'use client'

/* ============================================================
   features/bookings/components/date-rail.tsx
   Rail de dates vertical — mobile uniquement
   ============================================================ */

interface DateRailProps {
  dates:          string[]   // ISO dates des courses
  selectedDate:   string | null
  onSelect:       (date: string) => void
}

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const DAYS_FR   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

export function DateRail({ dates, selectedDate, onSelect }: DateRailProps) {
  /* Déduplique et trie les dates uniques */
  const uniqueDates = [...new Set(
    dates.map(d => d ? new Date(d).toISOString().split('T')[0] : null).filter(Boolean)
  )].sort() as string[]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      gap: 6, paddingTop: 2,
      width: 48, flexShrink: 0,
    }}>
      {uniqueDates.map(dateStr => {
        const d       = new Date(dateStr + 'T12:00')
        const isActive = selectedDate === dateStr
        const today   = new Date().toISOString().split('T')[0]
        const isToday = dateStr === today

        return (
          <button
            key={dateStr}
            onClick={() => onSelect(dateStr)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              width: 48, minHeight: 58,
              borderRadius: 14, border: 'none', cursor: 'pointer',
              background: isActive
                ? '#ffffff'
                : 'rgba(255,255,255,0.04)',
              outline: isActive ? 'none' : '1px solid rgba(255,255,255,0.07)',
              transition: 'all 150ms ease',
              padding: '8px 4px', gap: 2,
            }}
          >
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 10, fontWeight: 500,
              color: isActive ? '#07090f' : 'rgba(255,255,255,0.35)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              {isToday ? 'Auj' : DAYS_FR[d.getDay()]}
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 20, lineHeight: 1,
              color: isActive ? '#07090f' : '#ffffff',
              letterSpacing: '-0.03em',
            }}>
              {d.getDate()}
            </span>
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 9, color: isActive ? '#07090f' : 'rgba(255,255,255,0.30)',
            }}>
              {MONTHS_FR[d.getMonth()]}
            </span>
          </button>
        )
      })}
    </div>
  )
}