'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Map } from 'lucide-react'
import { searchAddress, reverseGeocode, getCurrentPosition } from '../services/geocoding.service'
import type { Location, Suggestion } from '../types/location.types'

/* ============================================================
   features/locations/components/location-search.tsx

   Input de recherche d'adresse avec :
   - Proposition 1 : géolocalisation (bleu clair)
   - Proposition 2 : pointer sur la carte (bleu foncé)
   - Propositions 3+ : résultats Mapbox au frappe
   ============================================================ */

interface LocationSearchProps {
  placeholder: string
  value: string
  onChange: (label: string) => void
  onSelect: (location: Location) => void
  onMapPickRequest?: () => void   // demande à la carte de passer en mode "clic"
  icon?: React.ReactNode
  autoFocus?: boolean
}

export function LocationSearch({
  placeholder,
  value,
  onChange,
  onSelect,
  onMapPickRequest,
  icon,
  autoFocus,
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen]               = useState(false)
  const [loading, setLoading]         = useState(false)
  const [geoLoading, setGeoLoading]   = useState(false)
  const debounceRef                   = useRef<ReturnType<typeof setTimeout>>(null)
  const inputRef                      = useRef<HTMLInputElement>(null)

  /* ── Suggestions fixes (toujours présentes quand focus) ── */
  const fixedSuggestions: Suggestion[] = [
    { type: 'geolocation', label: 'Utiliser ma position',   sublabel: 'Position actuelle' },
    { type: 'map-pick',    label: 'Choisir sur la carte',   sublabel: 'Pointer un emplacement' },
  ]

  /* ── Recherche au frappe (debounce 350ms) ── */
  const handleInput = useCallback((val: string) => {
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const results = await searchAddress(val)
      setSuggestions(results.map(loc => ({
        type:     'result',
        label:    loc.label,
        sublabel: (loc as Location & { sublabel?: string }).sublabel,
        location: loc,
      })))
      setLoading(false)
    }, 350)
  }, [onChange])

  /* ── Géolocalisation ── */
  async function handleGeolocate() {
    setGeoLoading(true)
    setOpen(false)
    try {
      const { lat, lng } = await getCurrentPosition()
      const loc = await reverseGeocode(lat, lng)
      if (loc) {
        onChange(loc.label)
        onSelect(loc)
      }
    } catch {
      // permission refusée ou erreur
    } finally {
      setGeoLoading(false)
    }
  }

  /* ── Sélection d'un résultat ── */
  function handleSelect(s: Suggestion) {
    if (s.type === 'geolocation') { handleGeolocate(); return }
    if (s.type === 'map-pick')    { onMapPickRequest?.(); setOpen(false); return }
    if (s.location) {
      onChange(s.label)
      onSelect(s.location)
      setOpen(false)
      setSuggestions([])
    }
  }

  /* ── Fermer au clic extérieur ── */
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const showDropdown = open && (fixedSuggestions.length > 0 || suggestions.length > 0)
  const allSuggestions: Suggestion[] = [...fixedSuggestions, ...suggestions]

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <style>{`
        .loc-search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
        }
        .loc-search-input::placeholder { color: rgba(255,255,255,0.35); }

        .loc-suggestion {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background 120ms ease;
          border-radius: 8px;
        }
        .loc-suggestion:hover { background: rgba(255,255,255,0.06); }

        .loc-icon-geo  { background: rgba(74, 158, 255, 0.15); color: #4a9eff; }
        .loc-icon-map  { background: rgba(30, 100, 200, 0.20); color: #1e64c8; }
        .loc-icon-result { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); }
      `}</style>

      {/* ── Input ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 54,
        padding: '0 16px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${open ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: open ? '14px 14px 0 0' : 14,
        transition: 'border-color 150ms ease',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, display: 'flex' }}>
          {geoLoading ? <Spinner /> : (icon ?? <MapPin size={15} />)}
        </span>

        <input
          ref={inputRef}
          className="loc-search-input"
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
        />

        {loading && <Spinner />}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0, right: 0,
          zIndex: 100,
          background: '#0d1117',
          border: '1px solid rgba(255,255,255,0.10)',
          borderTop: 'none',
          borderRadius: '0 0 14px 14px',
          overflow: 'hidden',
          padding: '6px',
        }}>

          {allSuggestions.map((s, i) => (
            <div key={i}>
              {/* Séparateur entre fixes et résultats */}
              {s.type === 'result' && i === 2 && suggestions.length > 0 && (
                <div style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.06)',
                  margin: '4px 0',
                }} />
              )}

              <div className="loc-suggestion" onClick={() => handleSelect(s)}>
                {/* Icône */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                  className={
                    s.type === 'geolocation' ? 'loc-icon-geo'
                    : s.type === 'map-pick'  ? 'loc-icon-map'
                    : 'loc-icon-result'
                  }
                >
                  {s.type === 'geolocation' && <Navigation size={14} />}
                  {s.type === 'map-pick'    && <Map size={14} />}
                  {s.type === 'result'      && <MapPin size={14} />}
                </div>

                {/* Texte */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: s.type !== 'result' ? 500 : 400,
                    color: s.type === 'geolocation'
                      ? '#4a9eff'
                      : s.type === 'map-pick'
                        ? '#6b9fdd'
                        : '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {s.label}
                  </div>
                  {s.sublabel && (
                    <div style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.35)',
                      marginTop: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {s.sublabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

/* ── Spinner minimaliste ── */
function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}