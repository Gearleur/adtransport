'use client'

/* ============================================================
   features/driver/components/activity/activity-mobile.tsx
   ============================================================ */

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { RideActionCard } from './ride-action-card'
import { PriceConfirmSheet } from '../shared/price-confirm-sheet'
import { useDriverRides } from '../../hooks/use-driver-rides'
import type { DriverRide } from '../../services/driver.service'

export function ActivityMobile() {
  const { myRides, changeStatus, updatePrice, refetch } = useDriverRides()
  const [selectedRide, setSelectedRide] = useState<DriverRide | null>(null)

  const activeRides = myRides
    .filter(r => r.status === 'accepted' || r.status === 'in_progress')
    .sort((a, b) => {
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1
      if (b.status === 'in_progress' && a.status !== 'in_progress') return 1
      if (!a.scheduled_at || !b.scheduled_at) return 0
      return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    })

  async function handlePriceConfirm(rideId: string, price: number) {
    await updatePrice(rideId, price)
    await changeStatus(rideId, 'in_progress')
    await refetch()
  }

  async function handleFinish(ride: DriverRide) {
    await changeStatus(ride.id, 'completed')
  }

  return (
    <>
      <div style={{
        minHeight: '100dvh', background: '#07090f',
        paddingTop: 'max(20px, env(safe-area-inset-top, 16px))',
        paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
      }}>
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 24, color: '#ffffff',
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
            }}>En activité</h1>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.30)',
            }}>
              {activeRides.length > 0
                ? `${activeRides.length} course${activeRides.length > 1 ? 's' : ''} active${activeRides.length > 1 ? 's' : ''}`
                : 'Aucune course active'}
            </p>
          </div>

          {activeRides.length === 0 ? (
            <div style={{
              paddingTop: 60, textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlayCircle size={20} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              </div>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14, color: 'rgba(255,255,255,0.25)',
              }}>Aucune course active</p>
              <Link href="/conducteur" style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: '#60a5fa', textDecoration: 'none',
              }}>
                Voir les courses en attente →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeRides.map(ride => (
                <RideActionCard
                  key={ride.id}
                  ride={ride}
                  onStartRide={setSelectedRide}
                  onFinishRide={handleFinish}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRide && (
        <PriceConfirmSheet
          ride={selectedRide}
          onConfirm={handlePriceConfirm}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </>
  )
}