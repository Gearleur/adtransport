'use client'

import { useState } from 'react'
import { MapPin, Navigation, ArrowUpDown, Check } from 'lucide-react'
import { LocationSearch } from '@/features/locations/components/location-search'
import type { Location } from '@/features/locations/types/location.types'

interface LocationInputsBookingProps {
  onPickupSelect?:      (loc: Location) => void
  onDestinationSelect?: (loc: Location) => void
  onMapPickRequest?:    (field: 'pickup' | 'destination') => void
  externalPickup?:      Location | null
  externalDestination?: Location | null
}

export function LocationInputsBooking({
  onPickupSelect,
  onDestinationSelect,
  onMapPickRequest,
  externalPickup,
  externalDestination,
}: LocationInputsBookingProps) {
  const [pickupLabel,      setPickupLabel]      = useState('')
  const [destinationLabel, setDestinationLabel] = useState('')

  const displayPickup      = externalPickup?.label      ?? pickupLabel
  const displayDestination = externalDestination?.label ?? destinationLabel

  const pickupDone      = !!(externalPickup      || pickupLabel.length > 3)
  const destinationDone = !!(externalDestination || destinationLabel.length > 3)

  function handleSwap() {
    const tempLabel = pickupLabel
    setPickupLabel(destinationLabel)
    setDestinationLabel(tempLabel)
    if (externalPickup && externalDestination) {
      onPickupSelect?.(externalDestination)
      onDestinationSelect?.(externalPickup)
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', position: 'relative',
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <style>{`
        .swap-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.55);
          cursor: pointer; transition: all 150ms ease;
        }
        .swap-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .loc-done-bar {
          height: 2px;
          transition: background 300ms ease;
        }
      `}</style>

      {/* Liseré haut — pickup */}
      <div
        className="loc-done-bar"
        style={{ background: pickupDone ? '#91E2FF' : 'transparent' }}
      />

      {/* Pickup */}
      <LocationSearch
        placeholder="Lieu de prise en charge"
        value={displayPickup}
        onChange={setPickupLabel}
        onSelect={loc => { setPickupLabel(loc.label); onPickupSelect?.(loc) }}
        onMapPickRequest={() => onMapPickRequest?.('pickup')}
        icon={pickupDone
          ? <Check size={15} color="#91E2FF" strokeWidth={2.5} />
          : <MapPin size={15} />
        }
        autoFocus
      />

      {/* Séparateur + swap */}
      <div style={{
        position: 'relative', height: 2,
        background: 'rgba(255,255,255,0.06)', zIndex: 1,
      }}>
        <div style={{
          position: 'absolute', right: 16, top: '50%',
          transform: 'translateY(-50%)',
        }}>
          <button className="swap-btn" onClick={handleSwap} title="Inverser">
            <ArrowUpDown size={12} />
          </button>
        </div>
      </div>

      {/* Destination */}
      <LocationSearch
        placeholder="Destination"
        value={displayDestination}
        onChange={setDestinationLabel}
        onSelect={loc => { setDestinationLabel(loc.label); onDestinationSelect?.(loc) }}
        onMapPickRequest={() => onMapPickRequest?.('destination')}
        icon={destinationDone
          ? <Check size={15} color="#91E2FF" strokeWidth={2.5} />
          : <Navigation size={15} />
        }
      />

      {/* Liseré bas — destination */}
      <div
        className="loc-done-bar"
        style={{ background: destinationDone ? '#91E2FF' : 'transparent' }}
      />
    </div>
  )
}