'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary } from '@/components/ui/buttons'
import { AuthInput } from './auth-input'
import { useSearchParams } from 'next/navigation'
import { useLoginForm } from '../hooks/use-auth-form'

export function LoginForm() {
  const { form, errors, serverError, isLoading, handleChange, handleSubmit } = useLoginForm()

  return (
    <>
      <style>{`
        .login-mobile  { display: flex; }
        .login-desktop { display: none; }
        @media (min-width: 1024px) {
          .login-mobile  { display: none; }
          .login-desktop { display: flex; }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="login-mobile" style={{
        flexDirection: 'column',
        width: '100%',
      }}>

        {/* Flèche retour */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(255,255,255,0.70)',
          textDecoration: 'none', marginBottom: 32,
        }}>
          <ArrowLeft size={16} strokeWidth={2} />
        </Link>

        {/* Logo + titre — légèrement remonté */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <Logo size="md" />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 26,
            color: '#ffffff', letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: 8,
          }}>
            Bon retour
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6,
          }}>
            Connectez-vous pour réserver votre course
          </p>
        </div>

        <MobileForm
          form={form} errors={errors} serverError={serverError}
          isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit}
        />
      </div>

      {/* ── DESKTOP ── */}
      <div className="login-desktop" style={{
        flexDirection: 'column',
        width: '100%', maxWidth: 380,
      }}>

        {/* Flèche + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.70)',
            textDecoration: 'none', flexShrink: 0,
          }}>
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>
          <Logo size="md" />
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 28,
            color: '#ffffff', letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: 8,
          }}>
            Bon retour
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6,
          }}>
            Connectez-vous pour réserver votre course
          </p>
        </div>

        <MobileForm
          form={form} errors={errors} serverError={serverError}
          isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit}
        />
      </div>
    </>
  )
}

/* Formulaire partagé mobile + desktop */
function MobileForm({ form, errors, serverError, isLoading, handleChange, handleSubmit }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; errors: any; serverError: string | null
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (field: any, value: string) => void
  handleSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <AuthInput
        label="Email" type="email"
        value={form.email} onChange={v => handleChange('email', v)}
        placeholder="vous@exemple.fr" error={errors.email}
        autoComplete="email" autoFocus
      />

      <AuthInput
        label="Mot de passe" type="password"
        value={form.password} onChange={v => handleChange('password', v)}
        placeholder="••••••••" error={errors.password}
        autoComplete="current-password"
      />

      <div style={{ textAlign: 'right', marginTop: -8 }}>
        <Link href="/mot-de-passe-oublie" style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12, color: 'rgba(255,255,255,0.40)',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}>
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Message succès après inscription */}
      <SuccessBanner />

      {serverError && (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.20)',
          borderRadius: 10,
        }}>
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#ef4444' }}>
            {serverError}
          </p>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <BtnPrimary type="submit" fullWidth size="lg" loading={isLoading}>
          Se connecter
        </BtnPrimary>
      </div>

      <p style={{
        marginTop: 12, textAlign: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 13, color: 'rgba(255,255,255,0.35)',
      }}>
        Pas encore de compte ?{' '}
        <Link href="/inscription" style={{
          color: 'rgba(255,255,255,0.75)',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}>
          Créer un compte
        </Link>
      </p>

    </form>
  )
}

function SuccessBanner() {
  const searchParams = useSearchParams()
  if (!searchParams.get('registered')) return null
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(34,197,94,0.08)',
      border: '1px solid rgba(34,197,94,0.20)',
      borderRadius: 10, marginBottom: 4,
    }}>
      <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#22c55e' }}>
        Compte créé ! Vérifiez votre email puis connectez-vous.
      </p>
    </div>
  )
}