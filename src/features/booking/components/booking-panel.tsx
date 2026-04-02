'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AuthButton } from '@/features/auth/components/auth-button'
import { NavLinksInline } from '@/components/layout/nav-links-inline'
import { BtnPrimary } from '@/components/ui/buttons'
import { LocationInputsBooking } from './location-inputs-booking'
import { RideTypeSelector } from './ride-type-selector'
import { SchedulePicker } from './schedule-picker'
import { PassengerSelector } from './passenger-selector'
import { LocationPicker } from '@/features/locations/components/location-picker'
import { useBookingForm } from '../hooks/use-booking-form'
import { createBooking } from '../services/booking.service'
import { useAuth } from '@/features/auth/context/auth-context'

export function BookingPanel() {
  const router   = useRouter()
  const { user } = useAuth()
  const {
    form, errors, canSubmit,
    setPickup, setDestination, setRideType, setScheduledAt, setPassenger,
    validate, toDTO,
  } = useBookingForm()

  const [pickMode,     setPickMode]     = useState<'pickup' | 'destination' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError,  setServerError]  = useState<string | null>(null)

  async function handleSubmit() {
    if (!validate() || !user) return
    const dto = toDTO(user)
    if (!dto) return
    setIsSubmitting(true)
    setServerError(null)
    const { booking, error } = await createBooking(dto)
    setIsSubmitting(false)
    if (error) { setServerError(error); return }
    if (booking) router.push(`/reserver/confirmation?id=${booking.id}`)
  }

  return (
    <>
      {pickMode && (
        <LocationPicker
          field={pickMode}
          onConfirm={loc => {
            if (pickMode === 'pickup') setPickup(loc)
            else setDestination(loc)
            setPickMode(null)
          }}
          onCancel={() => setPickMode(null)}
        />
      )}

      <div style={{
        background: '#07090f',
        display: 'flex', flexDirection: 'column',
        padding: '44px 40px 36px',
        height: '100%', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 40, gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button onClick={() => router.back()} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.80)', cursor: 'pointer', flexShrink: 0,
            }}>
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
          </div>
          <NavLinksInline />
          <AuthButton />
        </div>

        {/* Trajet */}
        <div style={{ marginBottom: 16 }}>
          <LocationInputsBooking
            onPickupSelect={setPickup}
            onDestinationSelect={setDestination}
            onMapPickRequest={field => setPickMode(field)}
            externalPickup={form.pickup}
            externalDestination={form.destination}
          />
        </div>

        <RideTypeSelector selected={form.rideType} onChange={setRideType} />

        {form.rideType === 'schedule' && (
          <div style={{ marginTop: 20 }}>
            <SchedulePicker
              value={form.scheduledAt}
              onChange={setScheduledAt}
              error={errors.scheduledAt}
            />
          </div>
        )}

        {/* Passager */}
        <div style={{ marginTop: 20 }}>
          <label style={{
            display: 'block',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Passager
          </label>
          <PassengerSelector
            value={form.passenger}
            onChange={setPassenger}
          />
        </div>

        {serverError && (
          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.20)',
            borderRadius: 10,
          }}>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#ef4444' }}>
              {serverError}
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <BtnPrimary fullWidth size="lg" disabled={!canSubmit} loading={isSubmitting} onClick={handleSubmit}>
            Continuer
          </BtnPrimary>
          {!canSubmit && (
            <p style={{
              marginTop: 10, textAlign: 'center', fontSize: 12,
              color: 'rgba(255,255,255,0.28)',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              {!form.pickup || !form.destination
                ? 'Renseignez les deux adresses pour continuer'
                : 'Choisissez une date et une heure'}
            </p>
          )}
        </div>
      </div>
    </>
  )
}