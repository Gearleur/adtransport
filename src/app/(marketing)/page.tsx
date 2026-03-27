import { HeroMobile } from '@/features/marketing/components/hero-mobile'
import { HeroPanel } from '@/features/marketing/components/hero-panel'
import { MapComponent } from '@/features/locations/components/map-component'

export default function HomePage() {
  return (
    <>
      <style>{`
        .layout-mobile  { display: block; height: 100dvh; overflow: hidden; }
        .layout-desktop { display: none; }

        @media (min-width: 1024px) {
          .layout-mobile  { display: none; }
          .layout-desktop {
            display: grid;
            grid-template-columns: 2fr 5fr;
            height: 100dvh;
            overflow: hidden;
            background: #07090f;
            padding: 16px 16px 16px 0;
          }
        }
      `}</style>

      <div className="layout-mobile">
        <HeroMobile />
      </div>

      <div className="layout-desktop">
        <HeroPanel />

        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
        }}>
          <MapComponent style={{ width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 64,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, #07090f, transparent)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 48,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, #07090f, transparent)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
            pointerEvents: 'none',
            background: 'linear-gradient(to top, #07090f, transparent)',
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 48,
            pointerEvents: 'none',
            background: 'linear-gradient(to left, #07090f, transparent)',
          }} />
        </div>
      </div>
    </>
  )
}