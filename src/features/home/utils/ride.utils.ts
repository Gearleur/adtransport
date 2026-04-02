/* ============================================================
   features/home/utils/ride.utils.ts
   Fonctions pures — pas de dépendances React
   ============================================================ */

import type { RideCardData, RideStatus } from '../components/ride-card'
import type { Booking } from '@/features/booking/types/booking.types'

/* ── Transforme un Booking Supabase en RideCardData UI ── */
export function bookingToRideCard(b: Booking): RideCardData {
  return {
    id:           b.id,
    status:       (b.status ?? 'pending') as RideStatus,
    pickupLabel:  b.pickup_address,
    pickupCity:   extractCity(b.pickup_address),
    dropoffLabel: b.dropoff_address,
    dropoffCity:  extractCity(b.dropoff_address),
    scheduledAt:    b.scheduled_at,
    price:          b.driver_price ?? b.estimated_price ?? null,
    passengerName:  b.passenger_name ?? null,
    distanceKm:     b.distance_km ?? null,
    durationMin:    b.duration_min ?? null,
  }
}

/* ── Extrait la partie courte d'une adresse ── */
export function extractCity(address: string): string {
  const parts = address.split(',').map(p => p.trim())
  /* Si le premier segment est un numéro seul, combine avec le suivant */
  if (parts.length > 1 && /^\d+$/.test(parts[0])) {
    return `${parts[0]} ${parts[1]}`
  }
  return parts[0] ?? address
}

/* ── Formate une date ISO pour affichage ── */
export function formatRideDate(iso: string | null) {
  if (!iso) return { dayLabel: '--', monthLabel: '', timeLabel: 'Maintenant', dateKey: '' }
  const d = new Date(iso)
  return {
    dayLabel:   d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
    monthLabel: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    timeLabel:  d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    dateKey:    d.toISOString().split('T')[0],
  }
}

/* ── Tronque un texte ── */
export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

/* ── Trie les courses : en cours → à venir → terminées → annulées ── */
export function sortRides(rides: RideCardData[]): RideCardData[] {
  const order: Record<RideStatus, number> = {
    in_progress: 0, accepted: 1, upcoming: 1, pending: 2, completed: 3, cancelled: 4,
  }
  return [...rides].sort((a, b) => {
    const byStatus = order[a.status] - order[b.status]
    if (byStatus !== 0) return byStatus
    if (!a.scheduledAt || !b.scheduledAt) return 0
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  })
}

/* ── Génère tous les jours du mois courant ── */
export function getCurrentMonthDays(): string[] {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()
  const days  = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  })
}

/* ── Dates des courses (pour highlight dans le rail) ── */
export function getRideDates(rides: RideCardData[]): Set<string> {
  return new Set(
    rides
      .map(r => r.scheduledAt ? new Date(r.scheduledAt).toISOString().split('T')[0] : null)
      .filter(Boolean) as string[]
  )
}