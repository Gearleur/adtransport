'use client'

/* ============================================================
   features/driver/components/driver-calendar.tsx
   Calendrier des courses acceptées
   ============================================================ */

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import type { DriverRide, DriverRideStatus } from '../../services/driver.service'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

const STATUS_COLOR: Record<DriverRideStatus, string> = {
  pending:     '#fbbf24',
  accepted:    '#60a5fa',
  in_progress: '#4ade80',
  completed:   'rgba(255,255,255,0.25)',
  cancelled:   '#f87171',
}

const STATUS_LABEL: Record<DriverRideStatus, string> = {
  pending:     'En attente',
  accepted:    'Acceptée',
  in_progress: 'En cours',
  completed:   'Terminée',
  cancelled:   'Annulée',
}

interface DriverCalendarProps {
  rides: DriverRide[]
  onStatusChange: (rideId: string, status: DriverRideStatus) => Promise<string | null | undefined>
}

export function DriverCalendar({ rides, onStatusChange }: DriverCalendarProps) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected,  setSelected]  = useState<string | null>(null)

  const todayISO    = today.toISOString().split('T')[0]
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  /* Index des rides par jour */
  const ridesByDay: Record<string, DriverRide[]> = {}
  for (const r of rides) {
    if (!r.scheduled_at) continue
    const key = new Date(r.scheduled_at).toISOString().split('T')[0]
    if (!ridesByDay[key]) ridesByDay[key] = []
    ridesByDay[key].push(r)
  }

  /* Rides du jour sélectionné */
  const selectedRides = selected ? (ridesByDay[selected] ?? []) : []

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Calendrier ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: 16,
      }}>
        {/* Header mois */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 700, fontSize: 15, color: '#ffffff', letterSpacing: '-0.01em',
            }}>
              {MONTHS_FR[viewMonth]}
            </p>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.28)',
            }}>{viewYear}</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ fn: prevMonth, icon: <ChevronLeft size={13} strokeWidth={2}/> },
              { fn: nextMonth, icon: <ChevronRight size={13} strokeWidth={2}/> }].map((b, i) => (
              <button key={i} onClick={b.fn} style={{
                width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {b.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Jours semaine */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {DAYS_FR.map(d => (
            <div key={d} style={{
              textAlign: 'center',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 10, fontWeight: 500,
              color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em',
            }}>{d}</div>
          ))}
        </div>

        {/* Grille jours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day  = i + 1
            const iso  = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const dayRides = ridesByDay[iso] ?? []
            const isToday  = iso === todayISO
            const isSel    = iso === selected

            return (
              <button
                key={iso}
                onClick={() => setSelected(isSel ? null : iso)}
                style={{
                  height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: isSel ? '#ffffff' : isToday ? 'rgba(255,255,255,0.08)' : 'transparent',
                  outline: isToday && !isSel ? '1px solid rgba(255,255,255,0.18)' : 'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 2, position: 'relative', transition: 'all 100ms ease',
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, fontWeight: 500,
                  color: isSel ? '#07090f' : isToday ? '#fff' : 'rgba(255,255,255,0.60)',
                }}>
                  {day}
                </span>
                {/* Points colorés pour les courses */}
                {dayRides.length > 0 && (
                  <div style={{ display: 'flex', gap: 2 }}>
                    {dayRides.slice(0, 3).map((r, ri) => (
                      <div key={ri} style={{
                        width: 4, height: 4, borderRadius: 9999,
                        background: isSel ? '#07090f' : STATUS_COLOR[r.status],
                      }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Courses du jour sélectionné ── */}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {new Date(selected + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {selectedRides.length === 0 ? (
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.25)',
            }}>
              Aucune course ce jour
            </p>
          ) : (
            selectedRides.map(r => (
              <CalendarRideCard key={r.id} ride={r} onStatusChange={onStatusChange} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function CalendarRideCard({ ride, onStatusChange }: {
  ride: DriverRide
  onStatusChange: (rideId: string, status: DriverRideStatus) => Promise<string | null | undefined>
}) {
  const [loading, setLoading] = useState(false)

  const nextStatus: Partial<Record<DriverRideStatus, DriverRideStatus>> = {
    accepted:    'in_progress',
    in_progress: 'completed',
  }
  const next = nextStatus[ride.status]

  const nextLabel: Partial<Record<DriverRideStatus, string>> = {
    accepted:    'Démarrer',
    in_progress: 'Terminer',
  }

  async function handleNext() {
    if (!next) return
    setLoading(true)
    await onStatusChange(ride.id, next)
    setLoading(false)
  }

  const color = STATUS_COLOR[ride.status]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '12px 14px',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Heure */}
          {ride.scheduled_at && (
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12, color: 'rgba(255,255,255,0.40)', marginBottom: 4,
            }}>
              {new Date(ride.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          {/* Trajet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
              <MapPin size={11} color="#60a5fa" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, color: 'rgba(255,255,255,0.55)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {ride.pickup_address.split(',')[0]}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
              <MapPin size={11} color="#4ade80" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12, color: 'rgba(255,255,255,0.55)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {ride.dropoff_address.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Client + Prix */}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.30)',
            }}>
              {ride.passenger_name ?? ""}
            </span>
            {ride.driver_price && (
              <span style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 12, fontWeight: 700, color: '#ffffff',
              }}>
                {ride.driver_price}€
              </span>
            )}
          </div>
        </div>

        {/* Statut + action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 10, fontWeight: 600, color,
            letterSpacing: '0.04em',
          }}>
            {STATUS_LABEL[ride.status]}
          </span>
          {next && (
            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.08)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, fontWeight: 600, color: '#ffffff',
                transition: 'all 150ms ease',
              }}
            >
              {loading ? '...' : nextLabel[ride.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}