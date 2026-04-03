'use client'

/* ============================================================
   features/auth/components/forgot-password-form.tsx
   ============================================================ */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase/client'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary } from '@/components/ui/buttons'

export function ForgotPasswordForm() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit() {
    if (!email.trim()) { setError('Entrez votre adresse email.'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <>
      <style>{`
        .fp-input {
          width: 100%; height: 52px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; padding: 0 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px; color: #ffffff;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .fp-input:focus { border-color: rgba(255,255,255,0.28); }
        .fp-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      <div style={{
        minHeight: '100dvh', background: '#07090f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Logo size="md" />
          </div>

          {sent ? (
            /* ── Succès ── */
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 9999,
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11l6 6L19 5" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 8 }}>
                  Email envoyé !
                </p>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 }}>
                  Vérifiez votre boîte mail.<br />Le lien expire dans 1 heure.
                </p>
              </div>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
              }}>
                <ArrowLeft size={14} strokeWidth={2} />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ── Formulaire ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 800, fontSize: 24, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Mot de passe oublié
                </h1>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 }}>
                  Entrez votre email et nous vous enverrons<br />un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="fp-input"
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />

                {error && (
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#f87171',
                    padding: '10px 14px', background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10,
                  }}>{error}</p>
                )}

                <BtnPrimary fullWidth size="lg" loading={loading} onClick={handleSubmit}>
                  Envoyer le lien
                </BtnPrimary>

                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13, color: 'rgba(255,255,255,0.40)', textDecoration: 'none',
                  marginTop: 4,
                }}>
                  <ArrowLeft size={14} strokeWidth={2} />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}