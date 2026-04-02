'use client'

/* ============================================================
   features/profile/components/profile-mobile.tsx
   ============================================================ */

import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { ProfileInfoForm } from './profile-info-form'
import { ProfileDangerZone } from './profile-danger-zone'
import { useProfile } from '../hooks/use-profile'

export function ProfileMobile() {
  const { profile, isLoading, isSaving, error, success, save } = useProfile()

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
      }}>
        <Logo size="md" />
        <AuthButton />
      </div>

      <div style={{ padding: '28px 20px 0' }}>

        {/* Titre */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 26, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
          }}>
            Mon profil
          </h1>
          {profile && (
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.30)',
            }}>
              {profile.email}
            </p>
          )}
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : profile ? (
          <>
            {/* Section infos */}
            <Section label="Informations personnelles">
              <ProfileInfoForm
                profile={profile}
                isSaving={isSaving}
                success={success}
                error={error}
                onSave={save}
              />
            </Section>

            {/* Section compte */}
            <Section label="Compte">
              <ProfileDangerZone email={profile.email} />
            </Section>
          </>
        ) : (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.30)',
          }}>
            Impossible de charger votre profil.
          </p>
        )}
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 14,
      }}>
        {label}
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16,
      }}>
        {children}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 48, borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
        }} />
      ))}
    </div>
  )
}