'use client'

/* ============================================================
   features/booking/components/passenger-selector.tsx
   Mobile : bottom sheet
   Desktop : dropdown inline
   ============================================================ */

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, User, Star, Check, X, Phone } from 'lucide-react'
import { usePassengers } from '@/features/profile/hooks/use-passengers'
import type { Passenger, CreatePassengerDTO } from '@/features/profile/services/passenger.service'

import type { PassengerSelection } from '../types/booking.types'

interface PassengerSelectorProps {
  value:    PassengerSelection | null
  onChange: (v: PassengerSelection) => void
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const { passengers, add } = usePassengers()
  const [open,     setOpen]     = useState(false)
  const [mode,     setMode]     = useState<'list' | 'new'>('list')
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName,  setNewLastName]  = useState('')
  const [newPhone,     setNewPhone]     = useState('')
  const [save,     setSave]     = useState(false)
  const [saving,   setSaving]   = useState(false)
  const dropdownRef             = useRef<HTMLDivElement>(null)

  const selfPassenger = passengers.find(p => p.is_default)
  const others        = passengers.filter(p => !p.is_default)

  /* Auto-sélectionne le passager par défaut dès le chargement */
  useEffect(() => {
    if (!value && selfPassenger) {
      setTimeout(() => onChange({ type: 'self', passengerId: selfPassenger.id, name: `${selfPassenger.first_name} ${selfPassenger.last_name}`, phone: selfPassenger.phone }), 0)
    }
  }, [selfPassenger]) // eslint-disable-line react-hooks/exhaustive-deps

  const label = !value
    ? 'Choisir un passager'
    : value.type === 'self'
      ? (value.name ?? (selfPassenger ? `${selfPassenger.first_name} ${selfPassenger.last_name}` : 'Moi-même'))
      : value.type === 'saved'
        ? (value.name ?? 'Passager')
        : value.name || 'Nouveau passager'

  /* Ferme le dropdown desktop au clic extérieur — uniquement sur desktop */
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (!open || !isDesktop) return

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setMode('list')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function handleNew() {
    if (!newFirstName.trim() || !newLastName.trim() || !newPhone.trim()) return
    setSaving(true)
    const dto: CreatePassengerDTO = {
      first_name: newFirstName.trim(),
      last_name:  newLastName.trim(),
      phone:      newPhone.trim(),
      note:       null,
      is_default: false,
    }
    if (save) await add(dto)
    onChange({ type: 'new', name: `${newFirstName.trim()} ${newLastName.trim()}`, phone: newPhone.trim(), saveForLater: save })
    setSaving(false)
    setOpen(false)
    setMode('list')
    setNewFirstName('')
    setNewLastName('')
    setNewPhone('')
    setSave(false)
  }

  const listContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {selfPassenger && (
        <>
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>
            Moi-même
          </p>
          <OptionBtn
            isSelected={value?.type === 'self'}
            onClick={() => { onChange({ type: 'self', passengerId: selfPassenger.id, name: `${selfPassenger.first_name} ${selfPassenger.last_name}`, phone: selfPassenger.phone }); setOpen(false) }}
            avatar={selfPassenger.first_name[0].toUpperCase()}
            name={`${selfPassenger.first_name} ${selfPassenger.last_name}`}
            sub={selfPassenger.phone}
            isDefault
          />
        </>
      )}
      {others.length > 0 && (
        <>
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 14, marginBottom: 6 }}>
            Mes passagers
          </p>
          {others.map(p => (
            <OptionBtn
              key={p.id}
              isSelected={value?.type === 'saved' && value.passengerId === p.id}
              onClick={() => { onChange({ type: 'saved', passengerId: p.id, name: `${p.first_name} ${p.last_name}`, phone: p.phone }); setOpen(false) }}
              avatar={p.first_name[0].toUpperCase()}
              name={`${p.first_name} ${p.last_name}`}
              sub={p.note ?? undefined}
            />
          ))}
        </>
      )}
      <button
        onClick={() => setMode('new')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 8,
          width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)',
          outline: '1px dashed rgba(255,255,255,0.14)',
          transition: 'background 150ms ease',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 9999,
          background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Plus size={15} color="rgba(255,255,255,0.40)" strokeWidth={2} />
        </div>
        <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>
          Autre passager
        </span>
      </button>
    </div>
  )

  const newContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <SheetInput placeholder="Prénom" value={newFirstName} onChange={setNewFirstName} />
        <SheetInput placeholder="Nom" value={newLastName} onChange={setNewLastName} />
      </div>
      <SheetInput placeholder="+33 6 00 00 00 00" type="tel" value={newPhone} onChange={setNewPhone} />
      <button onClick={() => setSave(s => !s)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: save ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)',
        outline: save ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(255,255,255,0.08)',
        transition: 'all 150ms ease',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 4,
          background: save ? '#4ade80' : 'rgba(255,255,255,0.10)',
          border: save ? 'none' : '1px solid rgba(255,255,255,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms ease', flexShrink: 0,
        }}>
          {save && <Check size={10} color="#07090f" strokeWidth={3} />}
        </div>
        <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, fontWeight: 500, color: save ? '#4ade80' : 'rgba(255,255,255,0.40)' }}>
          Sauvegarder dans mes passagers
        </span>
      </button>
      <button
        onClick={handleNew}
        disabled={!newFirstName.trim() || !newLastName.trim() || !newPhone.trim() || saving}
        style={{
          width: '100%', height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: '#ffffff', color: '#07090f',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13, fontWeight: 700,
          opacity: (!newFirstName.trim() || !newLastName.trim() || !newPhone.trim()) ? 0.4 : 1,
          transition: 'opacity 150ms ease',
        }}
      >
        {saving ? 'Enregistrement...' : 'Confirmer'}
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        .ps-trigger {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 0 14px; height: 48px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px; cursor: pointer;
          transition: border-color 150ms ease;
        }
        .ps-trigger:hover { border-color: rgba(255,255,255,0.22); }

        /* Mobile : bottom sheet */
        .ps-sheet-overlay {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
          display: flex; align-items: flex-end; justify-content: center;
          animation: ps-fade 180ms ease;
        }
        .ps-sheet-panel {
          width: 100%; max-width: 520px;
          background: linear-gradient(160deg, #1e2130 0%, #131520 100%);
          border: 1px solid rgba(255,255,255,0.10); border-bottom: none;
          border-radius: 24px 24px 0 0;
          padding: 0 20px max(110px, calc(env(safe-area-inset-bottom, 0px) + 100px));
          max-height: 80dvh; overflow-y: auto;
        }

        /* Desktop : dropdown */
        .ps-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 200;
          background: linear-gradient(160deg, #1e2130 0%, #131520 100%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px; padding: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.60);
          animation: ps-fade 150ms ease;
        }

        .ps-mobile  { display: block; }
        .ps-desktop { display: none;  }
        @media (min-width: 1024px) {
          .ps-mobile  { display: none;  }
          .ps-desktop { display: block; }
        }
        @keyframes ps-fade { from { opacity: 0; } to { opacity: 1; } }
        .ps-input {
          width: 100%; height: 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; padding: 0 12px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; color: #ffffff;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .ps-input:focus { border-color: rgba(255,255,255,0.25); }
        .ps-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Trigger */}
      <button className="ps-trigger" onClick={() => { setOpen(o => !o); setMode('list') }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={15} color="rgba(255,255,255,0.40)" strokeWidth={1.8} />
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: value ? '#ffffff' : 'rgba(255,255,255,0.35)' }}>
            {label}
          </span>
        </div>
        <ChevronDown size={15} color="rgba(255,255,255,0.35)" strokeWidth={2}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
      </button>

      {/* ── Mobile bottom sheet ── */}
      {open && (
        <div className="ps-mobile">
          <div className="ps-sheet-overlay" onClick={e => { if (e.target === e.currentTarget) { setOpen(false); setMode('list') } }}>
            <div className="ps-sheet-panel">
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <SheetHeader
                mode={mode}
                onBack={() => setMode('list')}
                onClose={() => { setOpen(false); setMode('list') }}
              />
              {mode === 'list' ? listContent : newContent}
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop dropdown ── */}
      {open && (
        <div className="ps-desktop" ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="ps-dropdown">
            <SheetHeader
              mode={mode}
              onBack={() => setMode('list')}
              onClose={() => { setOpen(false); setMode('list') }}
              compact
            />
            {mode === 'list' ? listContent : newContent}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Sous-composants ── */

function OptionBtn({ isSelected, onClick, avatar, name, sub, isDefault }: {
  isSelected: boolean; onClick: () => void
  avatar: string; name: string; sub?: string; isDefault?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        outline: isSelected ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'all 150ms ease', marginBottom: 6,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9999, flexShrink: 0,
        background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700, fontSize: 13, color: '#ffffff',
      }}>
        {avatar}
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
            {name}
          </span>
          {isDefault && <Star size={10} color="#fbbf24" fill="#fbbf24" />}
        </div>
        {sub && (
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
            {sub}
          </p>
        )}
      </div>
      {isSelected && <Check size={14} color="#4ade80" strokeWidth={2.5} />}
    </button>
  )
}

function SheetHeader({ mode, onBack, onClose, compact }: {
  mode: 'list' | 'new'; onBack: () => void; onClose: () => void; compact?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: compact ? 12 : 20 }}>
      {mode === 'new' ? (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.50)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <X size={13} strokeWidth={2} />
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12 }}>Retour</span>
        </button>
      ) : (
        <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: compact ? 14 : 17, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Pour qui ?
        </p>
      )}
      <button onClick={onClose} style={{
        width: 28, height: 28, borderRadius: 9999, border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.50)',
      }}>
        <X size={13} strokeWidth={2} />
      </button>
    </div>
  )
}

function SheetInput({ placeholder, value, onChange, type = 'text' }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <input
      className="ps-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}