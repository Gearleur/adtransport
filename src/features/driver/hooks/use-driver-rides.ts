'use client'

/* ============================================================
   features/driver/hooks/use-driver-rides.ts
   ============================================================ */

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/context/auth-context'
import {
  getPendingRides, getMyRides,
  acceptRide, declineRide, updateRideStatus, updateRidePrice,
  type DriverRide, type DriverRideStatus,
} from '../services/driver.service'

export function useDriverRides() {
  const { user } = useAuth()
  const [pending,    setPending]    = useState<DriverRide[]>([])
  const [myRides,    setMyRides]    = useState<DriverRide[]>([])
  const [isLoading,  setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const [p, m] = await Promise.all([
        getPendingRides(),
        getMyRides(user.id),
      ])
      setPending(p)
      setMyRides(m)
    } catch {
      setError('Impossible de charger les courses')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  /* Realtime — recharge toutes les 30s */
  useEffect(() => {
    const interval = setInterval(() => load(), 30_000)
    return () => clearInterval(interval)
  }, [load])

  async function accept(rideId: string, price: number | null) {
    if (!user) return
    const { error } = await acceptRide(rideId, user.id, price)
    if (!error) await load()
    return error
  }

  async function decline(rideId: string) {
    const { error } = await declineRide(rideId)
    if (!error) await load()
    return error
  }

  async function changeStatus(rideId: string, status: DriverRideStatus) {
    const { error } = await updateRideStatus(rideId, status)
    if (!error) await load()
    return error
  }

  async function updatePrice(rideId: string, price: number) {
    const { error } = await updateRidePrice(rideId, price)
    if (!error) await load()
    return error
  }

  return {
    pending, myRides, isLoading, error,
    accept, decline, changeStatus, updatePrice,
    refetch: load,
  }
}