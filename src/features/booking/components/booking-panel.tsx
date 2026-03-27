'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { NavLinksInline } from '@/components/layout/nav-links-inline'
import { BtnPrimary } from '@/components/ui/buttons'
import { LocationInputsBooking } from './location-inputs-booking'
import { RideTypeSelector } from './ride-type-selector'
import { SchedulePicker } from './schedule-picker'
import { LocationPicker } from '@/features/locations/components/location-picker'
import { useBookingForm } from '../hooks/use-booking-form'
import { createBooking } from '../services/booking.service'
import { useAuth } from '@/features/auth/context/auth-context'

export function BookingPanel() {
  const router                = useRouter()
  const { user }              = useAuth()
  const {
    form, errors, canSubmit,
    setPickup, setDestination, setRideType, setScheduledAt,
    validate, toDTO,
  } = useBookingForm()

  const [pickMode, setPickMode]   = useState<'pickup' | 'destination' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)

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
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Logo size="md" />
          </Link>
          <NavLinksInline />
          <AuthButton />
        </div>

        {/* Inputs */}
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

        {/* Erreur serveur */}
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
          <BtnPrimary
            fullWidth size="lg"
            disabled={!canSubmit}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
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