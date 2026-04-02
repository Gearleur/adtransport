'use client'

/* ============================================================
   features/profile/components/profile-desktop.tsx
   ============================================================ */

import { useState } from 'react'
import { ProfileInfoForm }   from './info/profile-info-form'
import { ProfileDangerZone } from './info/profile-danger-zone'
import { ProfilePassengers } from './passengers/profile-passengers'
import { ProfileHistory }    from './history/profile-history'
import { useProfile } from '../hooks/use-profile'

type Tab = 'info' | 'passengers' | 'history'

const TABS: { key: Tab; label: string }[] = [
  { key: 'info',       label: 'Informations personnelles' },
  { key: 'passengers', label: 'Mes passagers'             },
  { key: 'history',    label: 'Historique des courses'    },
]

export function ProfileDesktop() {
  const { profile, isLoading, isSaving, error, success, save } = useProfile()
  const [tab, setTab] = useState<Tab>('info')

  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '108px 60px 60px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 36, color: '#ffffff',
            letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 6,
          }}>Mon profil</h1>
          {profile && (
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.30)' }}>
              {profile.email}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              background: tab === t.key ? '#ffffff' : 'rgba(255,255,255,0.06)',
              color: tab === t.key ? '#07090f' : 'rgba(255,255,255,0.50)',
              transition: 'all 150ms ease',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {isLoading && tab === 'info' ? <Skeleton /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {tab === 'info' && (
              <>
                <Section label="Informations personnelles">
                  {profile
                    ? <ProfileInfoForm profile={profile} isSaving={isSaving} success={success} error={error} onSave={save} />
                    : <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.30)' }}>Impossible de charger.</p>
                  }
                </Section>
                {profile && (
                  <Section label="Compte">
                    <ProfileDangerZone email={profile.email} />
                  </Section>
                )}
              </>
            )}
            {tab === 'passengers' && (
              <Section label="Mes passagers">
                <ProfilePassengers />
              </Section>
            )}
            {tab === 'history' && (
              <Section label="Historique des courses">
                <ProfileHistory />
              </Section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
      }}>{label}</p>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: '24px',
      }}>
        {children}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.5 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{
          height: 48, borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          animation: 'sk-pulse 1.8s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes sk-pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
    </div>
  )
}