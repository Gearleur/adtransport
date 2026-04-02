'use client'

/* ============================================================
   features/booking/hooks/use-booking-form.ts
   Aligné sur la nouvelle table `bookings`
   ============================================================ */

import { useState, useCallback } from 'react'
import type {
  BookingFormState,
  BookingFormErrors,
  CreateBookingDTO,
  RideType,
  ScheduledDateTime,
} from '../types/booking.types'
import type { Location } from '@/features/locations/types/location.types'
import type { User } from '@/features/auth/types/auth.types'

const INITIAL_STATE: BookingFormState = {
  pickup:      null,
  destination: null,
  rideType:    'now',
  scheduledAt: null,
  notes:       '',
}

export function useBookingForm() {
  const [form, setForm]     = useState<BookingFormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<BookingFormErrors>({})

  const setPickup = useCallback((loc: Location) => {
    setForm(prev => ({ ...prev, pickup: loc }))
    setErrors(prev => ({ ...prev, pickup: undefined }))
  }, [])

  const setDestination = useCallback((loc: Location) => {
    setForm(prev => ({ ...prev, destination: loc }))
    setErrors(prev => ({ ...prev, destination: undefined }))
  }, [])

  const setRideType = useCallback((type: RideType) => {
    setForm(prev => ({
      ...prev,
      rideType:    type,
      scheduledAt: type === 'now' ? null : prev.scheduledAt,
    }))
  }, [])

  const setScheduledAt = useCallback((dt: ScheduledDateTime | null) => {
    setForm(prev => ({ ...prev, scheduledAt: dt }))
    setErrors(prev => ({ ...prev, scheduledAt: undefined }))
  }, [])

  const setNotes = useCallback((notes: string) => {
    setForm(prev => ({ ...prev, notes }))
  }, [])

  const swapLocations = useCallback(() => {
    setForm(prev => ({
      ...prev,
      pickup:      prev.destination,
      destination: prev.pickup,
    }))
  }, [])

  /* ── Validation ── */
  function validate(): boolean {
    const newErrors: BookingFormErrors = {}

    if (!form.pickup)      newErrors.pickup      = 'Veuillez renseigner le lieu de départ'
    if (!form.destination) newErrors.destination = 'Veuillez renseigner la destination'

    if (form.rideType === 'schedule') {
      if (!form.scheduledAt) {
        newErrors.scheduledAt = 'Veuillez choisir une date et une heure'
      } else {
        const scheduled = new Date(`${form.scheduledAt.date}T${form.scheduledAt.time}`)
        if (scheduled <= new Date()) {
          newErrors.scheduledAt = 'La date doit être dans le futur'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ── Prépare le DTO pour Supabase (nouvelle table bookings) ── */
  function toDTO(user: User): CreateBookingDTO | null {
    if (!form.pickup || !form.destination) return null

    let scheduled_at: string | null = null
    if (form.rideType === 'schedule' && form.scheduledAt) {
      scheduled_at = new Date(
        `${form.scheduledAt.date}T${form.scheduledAt.time}`
      ).toISOString()
    }

    return {
      booker_id:       user.id,
      pickup_address:  form.pickup.label,
      dropoff_address: form.destination.label,
      pickup_lat:      form.pickup.lat,
      pickup_lng:      form.pickup.lng,
      dropoff_lat:     form.destination.lat,
      dropoff_lng:     form.destination.lng,
      passenger_name:  `${user.firstName} ${user.lastName}`.trim() || null,
      passenger_phone: user.phone || null,
      scheduled_at,
      notes:           form.notes || null,
      status:          'pending',
    }
  }

  const canSubmit =
    form.pickup !== null &&
    form.destination !== null &&
    (form.rideType === 'now' || form.scheduledAt !== null)

  return {
    form, errors, canSubmit,
    setPickup, setDestination, setRideType,
    setScheduledAt, setNotes, swapLocations,
    validate, toDTO,
  }
}