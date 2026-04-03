'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { RideCard } from './ride-card'
import type { RideCardData, RideStatus } from './ride-card'

type Filter = 'upcoming' | 'pending'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'pending',  label: 'En attente'  },
  { key: 'upcoming', label: 'À venir'     },
]

interface HomeMobileProps {
  upcoming: RideCardData[]
  past:     RideCardData[]
  all:      RideCardData[]
}

function groupByMonth(rides: RideCardData[]) {
  const groups: Record<string, RideCardData[]> = {}
  for (const r of rides) {
    const key = r.scheduledAt
      ? new Date(r.scheduledAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : 'Maintenant'
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  }
  return groups
}

const STATUS_TO_FILTER: Record<RideStatus, Filter | null> = {
  upcoming:    'upcoming',
  accepted:    'upcoming',
  in_progress: 'upcoming',
  pending:     'pending',
  completed:   null,
  cancelled:   null,
}

export function HomeMobile({ all }: HomeMobileProps) {
  const counts: Record<Filter, number> = {
    upcoming: all.filter(r => STATUS_TO_FILTER[r.status] === 'upcoming').length,
    pending:  all.filter(r => STATUS_TO_FILTER[r.status] === 'pending').length,
  }

  /* Défaut : pending si y en a, sinon upcoming */
  const [filter, setFilter] = useState<Filter>(
    () => counts.pending > 0 ? 'pending' : 'upcoming'
  )

  /* Auto-switch : si on est sur pending mais plus de pending → derived filter */
  const activeFilter: Filter = (filter === 'pending' && counts.pending === 0)
    ? 'upcoming'
    : filter

  const filtered = all
    .filter(r => STATUS_TO_FILTER[r.status] === activeFilter)
    .sort((a, b) => {
      if (!a.scheduledAt) return -1
      if (!b.scheduledAt) return 1
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    })

  const groups = groupByMonth(filtered)
  const months = Object.keys(groups)

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
      }}>
        <Logo size="md" />
        <AuthButton />
      </div>

      <div style={{ padding: '24px 20px 0' }}>

        {/* Titre + bouton */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 26, color: '#ffffff',
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
            }}>
              Mes courses
            </h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.30)',
            }}>
              {counts.upcoming > 0 ? `${counts.upcoming} à venir` : 'Aucune course à venir'}
            </p>
          </div>
          <Link href="/reserver" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 9999,
            background: '#ffffff', color: '#07090f',
            textDecoration: 'none', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.30)',
          }}>
            <Plus size={20} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <style>{`
            .filter-tab {
              display: inline-flex; align-items: center; gap: 6px;
              padding: 7px 14px; border-radius: 9999px; border: none;
              font-family: 'DM Sans', system-ui, sans-serif;
              font-size: 13px; font-weight: 500; cursor: pointer;
              white-space: nowrap; flex-shrink: 0;
              transition: all 150ms ease;
            }
            .filter-tab.active { background: #ffffff; color: #07090f; }
            .filter-tab.idle {
              background: rgba(255,255,255,0.06);
              color: rgba(255,255,255,0.50);
              outline: 1px solid rgba(255,255,255,0.08);
            }
            .filter-tab.idle:hover { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.75); }
            .filter-count {
              display: inline-flex; align-items: center; justify-content: center;
              min-width: 18px; height: 18px; border-radius: 9999px;
              font-size: 10px; font-weight: 700; padding: 0 4px;
            }
            .filter-tab.active .filter-count { background: rgba(0,0,0,0.12); color: #07090f; }
            .filter-tab.idle   .filter-count { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.50); }
          `}</style>

          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${activeFilter === f.key ? 'active' : 'idle'}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className="filter-count">{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          months.map(month => (
            <div key={month} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700, fontSize: 13, color: '#ffffff',
                  letterSpacing: '-0.01em', textTransform: 'capitalize',
                }}>
                  {month}
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 11, color: 'rgba(255,255,255,0.25)',
                }}>
                  {groups[month].length} course{groups[month].length > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {groups[month].map(r => <RideCard key={r.id} ride={r} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState({ filter }: { filter: Filter }) {
  const msgs: Record<Filter, string> = {
    upcoming: 'Aucune course à venir',
    pending:  'Aucune course en attente de validation',
  }
  return (
    <div style={{ padding: '48px 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.10)' }} />
      <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
        {msgs[filter]}
      </p>
      {filter === 'upcoming' && (
        <Link href="/reserver" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 18px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.70)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontWeight: 500, fontSize: 13, textDecoration: 'none',
        }}>
          <Plus size={13} strokeWidth={2} />
          Réserver une course
        </Link>
      )}
    </div>
  )
}