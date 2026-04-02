'use client'

import { HomeMobile }  from '@/features/home/components/home-mobile'
import { HomeDesktop } from '@/features/home/components/home-desktop'
import { useUserRides } from '@/features/home/hooks/use-user-rides'

/* Skeleton card — imite la forme d'une RideCard */
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: 90, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ width: 44, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ width: 40, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ width: 120, height: 16, borderRadius: 6, background: 'rgba(255,255,255,0.09)' }} />
          </div>
          <div style={{ width: 24, height: 24, borderRadius: 9999, background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ width: 40, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ width: 100, height: 16, borderRadius: 6, background: 'rgba(255,255,255,0.09)' }} />
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 20px' }} />
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 70, height: 11, borderRadius: 5, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ width: 50, height: 16, borderRadius: 6, background: 'rgba(255,255,255,0.07)' }} />
      </div>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <>
      <style>{`
        @keyframes sk-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .sk-pulse { animation: sk-pulse 1.8s ease-in-out infinite; }
        .home-mobile-sk  { display: block; }
        .home-desktop-sk { display: none; }
        @media (min-width: 1024px) {
          .home-mobile-sk  { display: none; }
          .home-desktop-sk { display: block; }
        }
      `}</style>

      {/* Mobile skeleton */}
      <div className="home-mobile-sk sk-pulse" style={{
        minHeight: '100dvh', background: '#07090f',
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, paddingTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 130, height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.10)' }} />
            <div style={{ width: 80, height: 12, borderRadius: 5, background: 'rgba(255,255,255,0.05)' }} />
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[80, 180, 90].map((w, i) => (
            <div key={i} style={{ width: w, height: 34, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="home-desktop-sk sk-pulse" style={{
        minHeight: '100dvh', background: '#07090f',
        maxWidth: 1000, margin: '0 auto', padding: '108px 60px 48px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 160, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.10)' }} />
            <div style={{ width: 90, height: 13, borderRadius: 5, background: 'rgba(255,255,255,0.05)' }} />
          </div>
          <div style={{ width: 150, height: 42, borderRadius: 9999, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Calendar skeleton */}
          <div style={{ width: 260, height: 320, borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  const { upcoming, past, all, isLoading } = useUserRides()

  if (isLoading) return <HomeSkeleton />

  return (
    <>
      <style>{`
        .home-mobile  { display: block; }
        .home-desktop { display: none;  }
        @media (min-width: 1024px) {
          .home-mobile  { display: none; }
          .home-desktop { display: block; }
        }
      `}</style>
      <div className="home-mobile">
        <HomeMobile upcoming={upcoming} past={past} all={all} />
      </div>
      <div className="home-desktop">
        <HomeDesktop upcoming={upcoming} past={past} all={all} />
      </div>
    </>
  )
}