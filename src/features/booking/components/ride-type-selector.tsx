'use client'

/* ============================================================
   features/booking/components/ride-type-selector.tsx

   Sélecteur : Maintenant | Programmer la course
   État local — sera connecté au state booking plus tard
   ============================================================ */

interface RideTypeSelectorProps {
  selected: 'now' | 'schedule'
  onChange: (type: 'now' | 'schedule') => void
}

export function RideTypeSelector({ selected, onChange }: RideTypeSelectorProps) {
  return (
    <>
      <style>{`
        .ride-type-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-radius: 12px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 150ms ease;
        }
        .ride-type-btn.active {
          background: #ffffff;
          color: #07090f;
        }
        .ride-type-btn.inactive {
          background: transparent;
          color: rgba(255,255,255,0.45);
        }
        .ride-type-btn.inactive:hover {
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      <div style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          className={`ride-type-btn ${selected === 'now' ? 'active' : 'inactive'}`}
          onClick={() => onChange('now')}
        >
          Maintenant
        </button>
        <button
          className={`ride-type-btn ${selected === 'schedule' ? 'active' : 'inactive'}`}
          onClick={() => onChange('schedule')}
        >
          Programmer
        </button>
      </div>
    </>
  )
}