'use client'

/* ============================================================
   features/profile/components/profile-danger-zone.tsx
   Déconnexion + changement de mot de passe + suppression compte
   ============================================================ */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, KeyRound, Trash2 } from 'lucide-react'
import { sendPasswordReset } from '../services/profile.service'

interface ProfileDangerZoneProps {
  email: string
}

export function ProfileDangerZone({ email }: ProfileDangerZoneProps) {
  const router = useRouter()
  const [pwSent,    setPwSent]    = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  async function handleLogout() {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    router.push('/')
  }

  async function handlePasswordReset() {
    setPwLoading(true)
    await sendPasswordReset(email)
    setPwLoading(false)
    setPwSent(true)
  }

  return (
    <>
      <style>{`
        .dz-btn {
          display: inline-flex; align-items: center; gap: 9px;
          width: 100%; padding: 13px 16px;
          border-radius: 12px; border: none; cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; font-weight: 500;
          text-align: left; transition: all 150ms ease;
        }
        .dz-btn.neutral {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.70);
        }
        .dz-btn.neutral:hover {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }
        .dz-btn.danger {
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.15);
          color: rgba(248,113,113,0.80);
        }
        .dz-btn.danger:hover {
          background: rgba(248,113,113,0.10);
          color: #f87171;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Changer le mot de passe */}
        <button className="dz-btn neutral" onClick={handlePasswordReset} disabled={pwLoading || pwSent}>
          <KeyRound size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ lineHeight: 1.2 }}>
              {pwSent ? 'Email envoyé !' : pwLoading ? 'Envoi...' : 'Changer le mot de passe'}
            </p>
            {pwSent && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                Vérifiez votre boîte mail.
              </p>
            )}
          </div>
        </button>

        {/* Déconnexion */}
        <button className="dz-btn neutral" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          Se déconnecter
        </button>

        {/* Supprimer le compte — désactivé MVP */}
        <button className="dz-btn danger" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
          <Trash2 size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ lineHeight: 1.2 }}>Supprimer le compte</p>
            <p style={{ fontSize: 12, color: 'rgba(248,113,113,0.60)', marginTop: 2 }}>
              Bientôt disponible
            </p>
          </div>
        </button>

      </div>
    </>
  )
}