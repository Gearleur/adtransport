'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { RideCard } from './ride-card'
import { RideCalendar } from './ride-calendar'
import { getRideDates } from '../utils/ride.utils'
import type { RideCardData, RideStatus } from './ride-card'

type Filter = 'all' | 'upcoming' | 'pending' | 'past'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',      label: 'Toutes'      },
  { key: 'upcoming', label: 'À venir'     },
  { key: 'pending',  label: 'En attente'  },
  { key: 'past',     label: 'Historique'  },
]

const STATUS_TO_FILTER: Record<RideStatus, Filter> = {
  upcoming:    'upcoming',
  accepted:    'upcoming',
  in_progress: 'upcoming',
  pending:     'pending',
  completed:   'past',
  cancelled:   'past',
}

interface HomeDesktopProps {
  upcoming: RideCardData[]
  past:     RideCardData[]
  all:      RideCardData[]
}

export function HomeDesktop({ upcoming, past, all }: HomeDesktopProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filter, setFilter]             = useState<Filter>('all')
  const rideDates = getRideDates(all)

  const counts: Record<Filter, number> = {
    all:      all.length,
    upcoming: all.filter(r => STATUS_TO_FILTER[r.status] === 'upcoming').length,
    pending:  all.filter(r => STATUS_TO_FILTER[r.status] === 'pending').length,
    past:     all.filter(r => STATUS_TO_FILTER[r.status] === 'past').length,
  }

  const filterByStatus = (rides: RideCardData[]) =>
    filter === 'all' ? rides : rides.filter(r => STATUS_TO_FILTER[r.status] === filter)

  const filterByDate = (rides: RideCardData[]) =>
    selectedDate ? rides.filter(r => r.scheduledAt?.startsWith(selectedDate)) : rides

  const filteredUpcoming = filterByDate(filterByStatus(upcoming))
  const filteredPast     = filterByDate(filterByStatus(past))
  const filteredAll      = filterByDate(filterByStatus(all))

  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>



      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '108px 60px 48px' }}>

        {/* Titre */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 40,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 36, color: '#ffffff',
              letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 6,
            }}>
              Mes courses
            </h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.30)',
            }}>
              {upcoming.length > 0 ? `${upcoming.length} à venir` : 'Aucune course à venir'}
            </p>
          </div>
          <Link href="/reserver" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', borderRadius: 9999,
            background: '#ffffff', color: '#07090f',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}>
            <Plus size={16} strokeWidth={2.5} />
            Nouvelle course
          </Link>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <style>{`
            .dt-filter {
              display: inline-flex; align-items: center; gap: 6px;
              padding: 7px 16px; border-radius: 9999px; border: none; cursor: pointer;
              font-family: 'DM Sans', system-ui, sans-serif;
              font-size: 13px; font-weight: 500;
              transition: all 150ms ease;
            }
            .dt-filter.active { background: #ffffff; color: #07090f; }
            .dt-filter.idle {
              background: rgba(255,255,255,0.06);
              color: rgba(255,255,255,0.50);
              outline: 1px solid rgba(255,255,255,0.08);
            }
            .dt-filter.idle:hover { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.75); }
            .dt-filter-count {
              display: inline-flex; align-items: center; justify-content: center;
              min-width: 18px; height: 18px; border-radius: 9999px;
              font-size: 10px; font-weight: 700; padding: 0 4px;
            }
            .dt-filter.active .dt-filter-count { background: rgba(0,0,0,0.12); color: #07090f; }
            .dt-filter.idle   .dt-filter-count { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.50); }
          `}</style>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`dt-filter ${filter === f.key ? 'active' : 'idle'}`}
              onClick={() => { setFilter(f.key); setSelectedDate('') }}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className="dt-filter-count">{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Layout : rail + cards */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* Calendrier desktop */}
          <div style={{ position: 'sticky', top: 24 }}>
            <RideCalendar
              rideDates={rideDates}
              selectedDate={selectedDate || null}
              onSelect={d => { setSelectedDate(prev => prev === d ? '' : d); setFilter('all') }}
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', marginTop: 10, padding: '8px 0',
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, fontWeight: 500,
                  color: 'rgba(255,255,255,0.40)',
                  transition: 'all 150ms ease',
                }}
              >
                ← Toutes les courses
              </button>
            )}
          </div>

          {/* Cards */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {all.length === 0 ? (
              <EmptyState />
            ) : filter === 'all' ? (
              <>
                {filteredUpcoming.length > 0 && (
                  <Section label="À venir" rides={filteredUpcoming} />
                )}
                {filteredPast.length > 0 && (
                  <Section label="Historique" rides={filteredPast} />
                )}
                {filteredUpcoming.length === 0 && filteredPast.length === 0 && (
                  <EmptyFilter />
                )}
              </>
            ) : (
              <>
                {filteredAll.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filteredAll.map(r => <RideCard key={r.id} ride={r} />)}
                  </div>
                ) : (
                  <EmptyFilter />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyFilter() {
  return (
    <p style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: 14, color: 'rgba(255,255,255,0.28)',
      textAlign: 'center', paddingTop: 60,
    }}>
      Aucune course
    </p>
  )
}

function Section({ label, rides }: { label: string; rides: RideCardData[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        marginBottom: 14,
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rides.map(r => <RideCard key={r.id} ride={r} />)}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 24, background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{
        width: 1, height: 32,
        background: 'rgba(255,255,255,0.10)',
      }} />
      <div>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 6,
        }}>Aucune course</p>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
        }}>
          Réservez votre première course pour qu’elle apparaisse ici.
        </p>
      </div>
      <Link href="/reserver" style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '12px 24px', borderRadius: 9999,
        background: '#ffffff', color: '#07090f',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontWeight: 600, fontSize: 14, textDecoration: 'none', marginTop: 4,
      }}>
        <Plus size={15} strokeWidth={2.5} />
        Réserver une course
      </Link>
    </div>
  )
}