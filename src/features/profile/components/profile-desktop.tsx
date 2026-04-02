'use client'

/* ============================================================
   features/profile/components/profile-desktop.tsx
   ============================================================ */

import { ProfileInfoForm } from './profile-info-form'
import { ProfileDangerZone } from './profile-danger-zone'
import { useProfile } from '../hooks/use-profile'

export function ProfileDesktop() {
  const { profile, isLoading, isSaving, error, success, save } = useProfile()

  return (
    <div style={{ minHeight: '100dvh', background: '#07090f' }}>

      <main style={{
        maxWidth: 720, margin: '0 auto',
        padding: '108px 60px 60px',
      }}>

        {/* Titre */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 36, color: '#ffffff',
            letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 6,
          }}>
            Mon profil
          </h1>
          {profile && (
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.30)',
            }}>
              {profile.email}
            </p>
          )}
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : profile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <Section label="Informations personnelles">
              <ProfileInfoForm
                profile={profile}
                isSaving={isSaving}
                success={success}
                error={error}
                onSave={save}
              />
            </Section>

            <Section label="Compte">
              <ProfileDangerZone email={profile.email} />
            </Section>

          </div>
        ) : (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.30)',
          }}>
            Impossible de charger votre profil.
          </p>
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
        fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        {label}
      </p>
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

function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.5 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{
          height: 48, borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          animation: 'sk-pulse 1.8s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes sk-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  )
}