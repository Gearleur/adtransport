'use client'

import { useState } from 'react'
import { MapPin, Navigation, ArrowUpDown } from 'lucide-react'
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
  const [pickupLabel, setPickupLabel]           = useState('')
  const [destinationLabel, setDestinationLabel] = useState('')

  /* Labels affichés : priorité à la location externe (clic carte) */
  const displayPickup      = externalPickup?.label      ?? pickupLabel
  const displayDestination = externalDestination?.label ?? destinationLabel

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
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
      `}</style>

      {/* Pickup */}
      <LocationSearch
        placeholder="Lieu de prise en charge"
        value={displayPickup}
        onChange={setPickupLabel}
        onSelect={loc => { setPickupLabel(loc.label); onPickupSelect?.(loc) }}
        onMapPickRequest={() => onMapPickRequest?.('pickup')}
        icon={<MapPin size={15} />}
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
        icon={<Navigation size={15} />}
      />
    </div>
  )
}