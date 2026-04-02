'use client'

import { useEffect, useRef, useState } from 'react'
import { reverseGeocode } from '@/features/locations/services/geocoding.service'
import type { Location } from '@/features/locations/types/location.types'

interface MapComponentProps {
  className?: string
  style?: React.CSSProperties
  center?: [number, number]
  zoom?: number
  pickMode?: 'pickup' | 'destination' | null
  onLocationPicked?: (field: 'pickup' | 'destination', location: Location) => void
}

export function MapComponent({
  className,
  style,
  center = [48.8566, 2.3522],
  zoom = 13,
  pickMode = null,
  onLocationPicked,
}: MapComponentProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<unknown>(null)
  const pickModeRef   = useRef(pickMode)
  const onPickedRef   = useRef(onLocationPicked)
  const [pinState, setPinState] = useState<'idle' | 'dragging' | 'dropping'>('idle')
  const [address, setAddress]   = useState<string | null>(null)

  pickModeRef.current = pickMode
  onPickedRef.current = onLocationPicked

  useEffect(() => {
    if (!pickMode) { setAddress(null); setPinState('idle') }
    else setPinState('idle')
  }, [pickMode])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if ('_leaflet_id' in containerRef.current) return

    async function initMap() {


      if (!document.getElementById('leaflet-css')) {
        const link  = document.createElement('link')
        link.id     = 'leaflet-css'
        link.rel    = 'stylesheet'
        link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        await new Promise<void>(r => { link.onload = () => r(); setTimeout(r, 500) })
      }

      const L = (await import('leaflet')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current!, {
        center, zoom,
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,   // France + Belgique + Allemagne visibles
        maxZoom: 18,
      })

      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 20,
          attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(map)

      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      map.on('movestart', () => {
        if (!pickModeRef.current) return
        setPinState('dragging')
        setAddress(null)
      })

      map.on('moveend', async () => {
        if (!pickModeRef.current) return
        setPinState('dropping')
        await new Promise(r => setTimeout(r, 300))
        const c   = map.getCenter()
        const loc = await reverseGeocode(c.lat, c.lng)
        if (loc) {
          setAddress(loc.label)
          onPickedRef.current?.(pickModeRef.current, loc)
        }
        setPinState('idle')
      })

      mapRef.current = map
    }

    initMap()

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapRef.current as any).remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pinOffset = pinState === 'dragging' ? -24 : 0

  return (
    <>
      <style>{`
        .leaflet-tile { filter: contrast(1.05) brightness(1.15) saturate(0.9) !important; }
        .leaflet-container {
          background: #07090f !important;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.10) !important;
          border-radius: 12px !important; overflow: hidden;
          margin-bottom: 24px !important; margin-right: 16px !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom a {
          background: rgba(13,17,23,0.85) !important;
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          width: 36px !important; height: 36px !important;
          line-height: 36px !important; font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(255,255,255,0.10) !important; color: #fff !important; }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out { border-radius: 0 !important; }
        .leaflet-control-attribution {
          background: rgba(7,9,15,0.6) !important; color: rgba(255,255,255,0.25) !important;
          font-size: 10px !important; padding: 3px 8px !important;
          border-radius: 6px 0 0 0 !important; box-shadow: none !important;
        }
        .leaflet-control-attribution a { color: rgba(255,255,255,0.35) !important; }
        @keyframes pin-drop {
          0%   { transform: translateY(-20px); }
          60%  { transform: translateY(4px); }
          80%  { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        .pin-drop-anim { animation: pin-drop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      <div
        className={className}
        style={{ position: 'relative', width: '100%', height: '100%', ...style }}
      >
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {pickMode && (
          <div style={{
            position: 'absolute',
            top: 'calc(50% - 42px)',
            left: 'calc(50% - 16px)',
            zIndex: 1000,
            pointerEvents: 'none',
          }}>
            <div
              className={pinState === 'dropping' ? 'pin-drop-anim' : ''}
              style={{
                transform: `translateY(${pinOffset}px)`,
                transition: pinState === 'dragging'
                  ? 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
                filter: pinState === 'dragging'
                  ? 'drop-shadow(0 8px 16px rgba(74,158,255,0.5))'
                  : 'drop-shadow(0 2px 8px rgba(74,158,255,0.3))',
              }}
            >
              <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
                <ellipse cx="16" cy="40" rx="7" ry="2.5" fill="rgba(0,0,0,0.3)"
                  style={{
                    opacity: pinState === 'dragging' ? 0.1 : 0.6,
                    transition: 'opacity 150ms ease',
                  }}
                />
                <path
                  d="M16 1C10.477 1 6 5.477 6 11c0 8.5 10 26 10 26S26 19.5 26 11C26 5.477 21.523 1 16 1z"
                  fill="#4a9eff"
                />
                <circle cx="16" cy="11" r="5" fill="white"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  )
}