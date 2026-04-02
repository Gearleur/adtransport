'use client'

/* ============================================================
   features/driver/components/activity/activity-desktop.tsx
   ============================================================ */

import { useState } from 'react'
import { PlayCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { DesktopRideCard } from './desktop-ride-card'
import { PriceConfirmSheet } from '../shared/price-confirm-sheet'
import { useDriverRides } from '../../hooks/use-driver-rides'
import type { DriverRide } from '../../services/driver.service'

export function ActivityDesktop() {
  const { myRides, isLoading, changeStatus, updatePrice, refetch } = useDriverRides()
  const [selectedRide, setSelectedRide] = useState<DriverRide | null>(null)
  const [acting, setActing]             = useState(false)

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

  async function handleFinish(rideId: string) {
    setActing(true)
    await changeStatus(rideId, 'completed')
    setActing(false)
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ minHeight: '100dvh', background: '#07090f' }}>
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '108px 60px 60px' }}>

          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', marginBottom: 40,
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 800, fontSize: 36, color: '#ffffff',
                letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 6,
              }}>En activité</h1>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14, color: 'rgba(255,255,255,0.30)',
              }}>
                {activeRides.length > 0
                  ? `${activeRides.length} course${activeRides.length > 1 ? 's' : ''} active${activeRides.length > 1 ? 's' : ''}`
                  : 'Aucune course active pour le moment'}
              </p>
            </div>
            <button onClick={refetch} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)',
            }}>
              <RefreshCw size={14} strokeWidth={2} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              Actualiser
            </button>
          </div>

          {activeRides.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 16, padding: '80px 20px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlayCircle size={24} color="rgba(255,255,255,0.20)" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700, fontSize: 16, color: '#ffffff', marginBottom: 6,
                }}>Aucune course active</p>
                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, color: 'rgba(255,255,255,0.30)', lineHeight: 1.6,
                }}>Les courses acceptées apparaîtront ici.</p>
              </div>
              <Link href="/conducteur" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 9999, textDecoration: 'none',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.10)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)',
              }}>
                Voir les courses en attente →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeRides.map(ride => (
                <DesktopRideCard
                  key={ride.id}
                  ride={ride}
                  onStart={setSelectedRide}
                  onFinish={handleFinish}
                  isActing={acting}
                />
              ))}
            </div>
          )}
        </main>
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