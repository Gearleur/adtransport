'use client'

/* ============================================================
   features/home/components/ride-calendar.tsx
   Calendrier desktop — style Notion/Linear, dark, minimaliste
   ============================================================ */

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

interface RideCalendarProps {
  rideDates:    Set<string>
  selectedDate: string | null
  onSelect:     (date: string) => void
}

export function RideCalendar({ rideDates, selectedDate, onSelect }: RideCalendarProps) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const todayISO    = today.toISOString().split('T')[0]
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = (firstDay + 6) % 7   // lundi = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  /* Nombre de courses dans le mois affiché */
  const monthRidesCount = [...rideDates].filter(d => {
    const dt = new Date(d + 'T12:00')
    return dt.getMonth() === viewMonth && dt.getFullYear() === viewYear
  }).length

  return (
    <>
      <style>{`
        .cal-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 20px;
          width: 260px;
          flex-shrink: 0;
        }
        .cal-day-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; border: none; cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 500;
          position: relative;
          transition: all 100ms ease;
        }
        .cal-day-btn.empty { background: transparent; cursor: default; }
        .cal-day-btn.past-no-ride {
          background: transparent; color: rgba(255,255,255,0.18); cursor: default;
        }
        .cal-day-btn.normal {
          background: transparent; color: rgba(255,255,255,0.60);
        }
        .cal-day-btn.normal:hover {
          background: rgba(255,255,255,0.07); color: #fff;
        }
        .cal-day-btn.has-ride {
          background: rgba(96,165,250,0.10);
          color: #93c5fd;
          outline: 1px solid rgba(96,165,250,0.25);
        }
        .cal-day-btn.has-ride:hover {
          background: rgba(96,165,250,0.18);
        }
        .cal-day-btn.is-today {
          color: #ffffff;
          outline: 1px solid rgba(255,255,255,0.25) !important;
        }
        .cal-day-btn.is-selected {
          background: #ffffff !important;
          color: #07090f !important;
          outline: none !important;
          font-weight: 700;
        }
        .ride-dot {
          position: absolute; bottom: 3px; left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 9999px;
        }
        .cal-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45); cursor: pointer;
          transition: all 120ms ease;
        }
        .cal-nav-btn:hover { background: rgba(255,255,255,0.10); color: #fff; }
      `}</style>

      <div className="cal-wrap">

        {/* Header mois */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 16,
        }}>
          <div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 700, fontSize: 14, color: '#ffffff',
              letterSpacing: '-0.01em', lineHeight: 1.1,
            }}>
              {MONTHS_FR[viewMonth]}
            </p>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.28)',
            }}>
              {viewYear}
              {monthRidesCount > 0 && (
                <span style={{
                  marginLeft: 6, color: '#60a5fa',
                }}>
                  · {monthRidesCount} course{monthRidesCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="cal-nav-btn" onClick={prevMonth}>
              <ChevronLeft size={13} strokeWidth={2} />
            </button>
            <button className="cal-nav-btn" onClick={nextMonth}>
              <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Jours de semaine */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 32px)',
          gap: 2, marginBottom: 4,
        }}>
          {DAYS_FR.map(d => (
            <div key={d} style={{
              width: 32, textAlign: 'center',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 10, fontWeight: 500,
              color: 'rgba(255,255,255,0.22)',
              letterSpacing: '0.04em',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grille jours */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 32px)', gap: 2,
        }}>
          {/* Cellules vides */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`e${i}`} className="cal-day-btn empty" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day     = i + 1
            const iso     = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const hasRide = rideDates.has(iso)
            const isToday = iso === todayISO
            const isPast  = iso < todayISO
            const isSel   = iso === selectedDate

            let cls = 'cal-day-btn '
            if (isSel)            cls += 'is-selected'
            else if (hasRide)     cls += 'has-ride' + (isToday ? ' is-today' : '')
            else if (isToday)     cls += 'normal is-today'
            else if (isPast)      cls += 'past-no-ride'
            else                  cls += 'normal'

            return (
              <button
                key={iso}
                className={cls}
                onClick={() => hasRide && onSelect(iso === selectedDate ? '' : iso)}
                style={{ cursor: hasRide ? 'pointer' : 'default' }}
              >
                {day}
                {hasRide && !isSel && (
                  <span
                    className="ride-dot"
                    style={{ background: isToday ? '#fff' : '#60a5fa' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Légende */}
        <div style={{
          marginTop: 16, paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 9999,
            background: '#60a5fa', opacity: 0.7, flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.28)',
          }}>
            Jour avec course
          </span>
        </div>

      </div>
    </>
  )
}