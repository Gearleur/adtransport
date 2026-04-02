'use client'

/* ============================================================
   features/profile/components/profile-mobile.tsx
   Navigation par pages — retour arrière natif
   ============================================================ */

import { useState } from 'react'
import { ArrowLeft, User, Users, Clock } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { AuthButton } from '@/features/auth/components/auth-button'
import { ProfileInfoForm }   from './info/profile-info-form'
import { ProfileDangerZone } from './info/profile-danger-zone'
import { ProfilePassengers } from './passengers/profile-passengers'
import { ProfileHistory }    from './history/profile-history'
import { useProfile } from '../hooks/use-profile'

type Page = null | 'info' | 'passengers' | 'history'

const MENU_ITEMS = [
  {
    key:   'info'       as Page,
    icon:  User,
    label: 'Informations personnelles',
    desc:  'Nom, téléphone, mot de passe',
  },
  {
    key:   'passengers' as Page,
    icon:  Users,
    label: 'Mes passagers',
    desc:  'Gérer vos passagers habituels',
  },
  {
    key:   'history'    as Page,
    icon:  Clock,
    label: 'Historique des courses',
    desc:  'Toutes vos courses passées',
  },
]

export function ProfileMobile() {
  const { profile, isLoading, isSaving, error, success, save } = useProfile()
  const [page, setPage] = useState<Page>(null)

  /* ── Menu principal ── */
  if (page === null) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#07090f',
        paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
        }}>
          <Logo size="md" />
          <AuthButton />
        </div>

        <div style={{ padding: '28px 20px 0' }}>
          {/* Titre + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 9999,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.60)',
              flexShrink: 0,
            }}>
              {profile?.first_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 18, color: '#ffffff',
                letterSpacing: '-0.01em', marginBottom: 2,
              }}>
                {profile ? `${profile.first_name} ${profile.last_name}` : '—'}
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.30)',
              }}>
                {profile?.email ?? ''}
              </p>
            </div>
          </div>

          {/* Items de menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MENU_ITEMS.map(({ key, icon: Icon, label, desc }) => (
              <button
                key={String(key)}
                onClick={() => setPage(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  outline: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'left', width: '100%',
                  transition: 'background 150ms ease',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.55)',
                }}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 2,
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 12, color: 'rgba(255,255,255,0.30)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Sous-page ── */
  const titles: Record<NonNullable<Page>, string> = {
    info:       'Informations',
    passengers: 'Mes passagers',
    history:    'Historique',
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#07090f',
      paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>
      {/* Header avec retour */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 0',
      }}>
        <button
          onClick={() => setPage(null)}
          style={{
            width: 36, height: 36, borderRadius: 9999, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.70)', flexShrink: 0,
          }}
        >
          <ArrowLeft size={17} strokeWidth={2} />
        </button>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 700, fontSize: 17, color: '#ffffff',
          letterSpacing: '-0.01em',
        }}>
          {titles[page]}
        </p>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        {page === 'info' && (
          <>
            {isLoading ? <Skeleton /> : profile ? (
              <>
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
              </>
            ) : (
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.30)',
              }}>
                Impossible de charger.
              </p>
            )}
          </>
        )}

        {page === 'passengers' && (
          <Section label="Mes passagers">
            <ProfilePassengers />
          </Section>
        )}

        {page === 'history' && (
          <Section label="Historique des courses">
            <ProfileHistory />
          </Section>
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
      }}>{label}</p>
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

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)' }} />
      ))}
    </div>
  )
}