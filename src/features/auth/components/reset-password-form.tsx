'use client'

/* ============================================================
   features/auth/components/reset-password-form.tsx
   ============================================================ */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary } from '@/components/ui/buttons'

type Step = 'loading' | 'form' | 'success' | 'invalid'

export function ResetPasswordForm() {
  const router                            = useRouter()
  const [step,     setStep]     = useState<Step>('loading')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') setStep('form')
      }
    )
    const timer = setTimeout(() => {
      setStep(s => s === 'loading' ? 'invalid' : s)
    }, 3000)
    return () => { subscription.unsubscribe(); clearTimeout(timer) }
  }, [])

  async function handleSubmit() {
    setError(null)
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setIsSaving(true)
    const { error } = await supabaseClient.auth.updateUser({ password })
    setIsSaving(false)
    if (error) { setError(error.message); return }
    setStep('success')
    setTimeout(() => router.push('/home'), 2500)
  }

  const strength = password.length >= 12 ? 4 : password.length >= 10 ? 3 : password.length >= 8 ? 2 : 1

  return (
    <>
      <style>{`
        .rp-input {
          width: 100%; height: 52px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; padding: 0 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px; color: #ffffff;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .rp-input:focus { border-color: rgba(255,255,255,0.28); }
        .rp-input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        @keyframes rp-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .rp-fade { animation: rp-fade 400ms ease forwards; }
      `}</style>

      <div style={{
        minHeight: '100dvh', background: '#07090f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 32 }}>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Logo size="md" />
          </div>

          {/* Loading */}
          {step === 'loading' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 20, height: 20, borderRadius: 9999,
                border: '2px solid rgba(255,255,255,0.12)',
                borderTopColor: '#ffffff',
                animation: 'rp-spin 0.8s linear infinite',
              }} />
            </div>
          )}

          {/* Lien invalide */}
          {step === 'invalid' && (
            <div className="rp-fade" style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 10 }}>
                Lien invalide ou expiré
              </p>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6, marginBottom: 24 }}>
                Ce lien de réinitialisation n’est plus valide.<br />
                Faites une nouvelle demande depuis votre profil.
              </p>
              <BtnPrimary href="/login" size="md">Retour à la connexion</BtnPrimary>
            </div>
          )}

          {/* Formulaire */}
          {step === 'form' && (
            <div className="rp-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 800, fontSize: 24, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Nouveau mot de passe
                </h1>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 }}>
                  Choisissez un mot de passe sécurisé d’au moins 8 caractères.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <input className="rp-input" type={showPw ? 'text' : 'password'}
                    placeholder="Nouveau mot de passe" value={password}
                    onChange={e => setPassword(e.target.value)} autoFocus />
                  <button onClick={() => setShowPw(s => !s)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', padding: 4,
                  }}>
                    {showPw ? 'CACHER' : 'VOIR'}
                  </button>
                </div>

                <input className="rp-input" type={showPw ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 9999,
                        background: i <= strength
                          ? strength >= 4 ? '#4ade80' : strength >= 3 ? '#60a5fa' : strength >= 2 ? '#fbbf24' : '#f87171'
                          : 'rgba(255,255,255,0.08)',
                        transition: 'background 200ms ease',
                      }} />
                    ))}
                  </div>
                )}

                {error && (
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#f87171',
                    padding: '10px 14px', background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10,
                  }}>{error}</p>
                )}

                <BtnPrimary fullWidth size="lg" loading={isSaving} onClick={handleSubmit}>
                  Confirmer le mot de passe
                </BtnPrimary>
              </div>
            </div>
          )}

          {/* Succès */}
          {step === 'success' && (
            <div className="rp-fade" style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 9999,
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11l5 5 9-9" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 8 }}>
                Mot de passe modifié !
              </p>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.40)' }}>
                Redirection en cours...
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}