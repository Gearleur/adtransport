'use client'

/* ============================================================
   features/profile/hooks/use-passengers.ts
   ============================================================ */

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/context/auth-context'
import {
  getPassengers, createPassenger, updatePassenger, deletePassenger,
  type Passenger, type CreatePassengerDTO,
} from '../services/passenger.service'

export function usePassengers() {
  const { user, isLoading: authLoading } = useAuth()
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [isLoading,  setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    let cancelled = false

    async function load() {
      if (!user) { setLoading(false); return }
      setLoading(true)
      const data = await getPassengers(user.id)
      if (!cancelled) {
        setPassengers(data)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user, authLoading])

  const refetch = useCallback(async () => {
    if (!user) return
    const data = await getPassengers(user.id)
    setPassengers(data)
  }, [user])

  async function add(dto: CreatePassengerDTO) {
    if (!user) return null
    const { error } = await createPassenger(user.id, dto)
    if (!error) await refetch()
    return error
  }

  async function update(passengerId: string, dto: Partial<CreatePassengerDTO>) {
    if (!user) return null
    const { error } = await updatePassenger(passengerId, user.id, dto)
    if (!error) await refetch()
    return error
  }

  async function remove(passengerId: string) {
    if (!user) return null
    const { error } = await deletePassenger(passengerId, user.id)
    if (!error) await refetch()
    return error
  }

  return { passengers, isLoading, error, add, update, remove, refetch }
}