'use client'

import { useState } from 'react'
import { Calendar, Clock, ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import type { ScheduledDateTime } from '../types/booking.types'

interface SchedulePickerProps {
  value:    ScheduledDateTime | null
  onChange: (dt: ScheduledDateTime) => void
  error?:   string
}

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

const TIME_SLOTS: string[] = []
for (let h = 0; h < 24; h++)
  for (const m of [0, 30])
    TIME_SLOTS.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)

function getTodayISO() { return new Date().toISOString().split('T')[0] }

function getMonthDays(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay + 6) % 7
  return { daysInMonth, startOffset }
}

function formatSummary(dt: ScheduledDateTime) {
  const d = new Date(`${dt.date}T${dt.time}`)
  const day  = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} à ${dt.time}`
}

type Step = 'closed' | 'calendar' | 'time'

export function SchedulePicker({ value, onChange, error }: SchedulePickerProps) {
  const today                 = new Date()
  const [step, setStep]       = useState<Step>(value ? 'closed' : 'calendar')
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(value?.date ?? null)

  const todayISO = getTodayISO()
  const { daysInMonth, startOffset } = getMonthDays(viewYear, viewMonth)

  function handleDayClick(iso: string) {
    setSelectedDate(iso)
    setStep('time')  /* ferme le calendrier, ouvre les horaires */
  }

  function handleTimeClick(time: string) {
    if (!selectedDate) return
    onChange({ date: selectedDate, time })
    setStep('closed')  /* tout ferme, affiche le récap */
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <style>{`
        .day-btn {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px;
          cursor: pointer; border: none; background: transparent;
          color: rgba(255,255,255,0.75); transition: all 120ms ease;
        }
        .day-btn:disabled { opacity: 0.22; cursor: not-allowed; }
        .day-btn:not(:disabled):hover { background: rgba(255,255,255,0.08); }
        .day-btn.today { border: 1px solid rgba(255,255,255,0.18); }
        .day-btn.selected { background: #fff !important; color: #07090f; font-weight: 600; }

        .time-slot {
          padding: 7px 0; border-radius: 8px; text-align: center;
          font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.65);
          transition: all 120ms ease;
        }
        .time-slot:hover:not(.disabled) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.15); }
        .time-slot.selected { background: #fff; color: #07090f; font-weight: 600; border-color: #fff; }
        .time-slot.disabled { opacity: 0.22; cursor: not-allowed; }

        .panel-toggle {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; transition: background 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.60);
          width: 100%;
        }
        .panel-toggle:hover { background: rgba(255,255,255,0.07); }
        .month-nav {
          background: none; border: none; color: rgba(255,255,255,0.45);
          cursor: pointer; padding: 4px; display: flex;
          transition: color 120ms ease;
        }
        .month-nav:hover { color: #fff; }
      `}</style>

      {/* ── Récapitulatif — toujours visible quand une valeur existe ── */}
      {value && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={14} color="rgba(255,255,255,0.5)" />
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, fontWeight: 500, color: '#ffffff',
            }}>
              {formatSummary(value)}
            </span>
          </div>
          {/* Bouton modifier */}
          <button
            onClick={() => setStep(step === 'closed' ? 'calendar' : 'closed')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.38)', fontSize: 12,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'color 150ms ease', padding: '2px 6px',
            }}
          >
            <Pencil size={11} />
            Modifier
          </button>
        </div>
      )}

      {/* ── Bouton pour ouvrir si aucune valeur ── */}
      {!value && step === 'closed' && (
        <button className="panel-toggle" onClick={() => setStep('calendar')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={14} />
            Choisir une date
          </span>
          <ChevronDown size={14} />
        </button>
      )}

      {/* ── Panel déroulant (calendrier + horaires) ── */}
      {step !== 'closed' && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, overflow: 'hidden',
        }}>

          {/* ── Calendrier ── */}
          {step === 'calendar' && (
            <div style={{ padding: 16 }}>

              {/* Header navigation mois */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 14,
              }}>
                <button className="month-nav" onClick={prevMonth}>
                  <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 600, fontSize: 14, color: '#ffffff',
                }}>
                  {MONTHS_FR[viewMonth]} {viewYear}
                </span>
                <button className="month-nav" onClick={nextMonth}>
                  <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>

              {/* Jours de semaine */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
                {DAYS_FR.map(d => (
                  <div key={d} style={{
                    textAlign: 'center', fontSize: 11, fontWeight: 500,
                    color: 'rgba(255,255,255,0.28)', padding: '4px 0',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Grille jours */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day  = i + 1
                  const iso  = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                  const past = iso < todayISO
                  const sel  = iso === selectedDate
                  const tod  = iso === todayISO
                  return (
                    <div key={iso} style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className={`day-btn${sel ? ' selected' : tod ? ' today' : ''}`}
                        disabled={past}
                        onClick={() => !past && handleDayClick(iso)}
                      >
                        {day}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Horaires ── */}
          {step === 'time' && (
            <div style={{ padding: 16 }}>

              {/* Header avec date sélectionnée + retour calendrier */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={13} color="rgba(255,255,255,0.4)" />
                  <span style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13, fontWeight: 500, color: '#ffffff',
                  }}>
                    {selectedDate && new Date(selectedDate + 'T12:00').toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}
                  </span>
                </div>
                <button
                  onClick={() => setStep('calendar')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.38)', fontSize: 12,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <ChevronDown size={11} style={{ transform: 'rotate(90deg)' }} />
                  Changer
                </button>
              </div>

              {/* Grille horaires */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6, maxHeight: 200, overflowY: 'auto',
              }}>
                {TIME_SLOTS.map(time => {
                  const isDisabled = selectedDate === todayISO &&
                    time <= new Date().toTimeString().slice(0, 5)
                  const isSel = value?.time === time && value?.date === selectedDate
                  return (
                    <button
                      key={time}
                      className={`time-slot${isSel ? ' selected' : isDisabled ? ' disabled' : ''}`}
                      onClick={() => !isDisabled && handleTimeClick(time)}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Erreur */}
      {error && (
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12, color: '#ef4444',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}