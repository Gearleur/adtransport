'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary } from '@/components/ui/buttons'
import { AuthInput } from './auth-input'
import { useRegisterForm } from '../hooks/use-auth-form'

export function RegisterForm() {
  const { form, errors, serverError, isLoading, handleChange, handleSubmit } = useRegisterForm()

  return (
    <>
      <style>{`
        .register-mobile  { display: flex; }
        .register-desktop { display: none; }
        @media (min-width: 1024px) {
          .register-mobile  { display: none; }
          .register-desktop { display: flex; }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="register-mobile" style={{ flexDirection: 'column', width: '100%' }}>

        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(255,255,255,0.70)',
          textDecoration: 'none', marginBottom: 28,
        }}>
          <ArrowLeft size={16} strokeWidth={2} />
        </Link>

        <div style={{ marginBottom: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <Logo size="md" />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 26,
            color: '#ffffff', letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: 8,
          }}>
            Créer un compte
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6,
          }}>
            Rejoignez AD Transport pour réserver vos courses
          </p>
        </div>

        <FormFields
          form={form} errors={errors} serverError={serverError}
          isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit}
        />
      </div>

      {/* ── DESKTOP ── */}
      <div className="register-desktop" style={{
        flexDirection: 'column', width: '100%', maxWidth: 380,
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
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

        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800, fontSize: 28,
            color: '#ffffff', letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: 8,
          }}>
            Créer un compte
          </h1>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6,
          }}>
            Rejoignez AD Transport pour réserver vos courses
          </p>
        </div>

        <FormFields
          form={form} errors={errors} serverError={serverError}
          isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit}
        />
      </div>
    </>
  )
}

function FormFields({ form, errors, serverError, isLoading, handleChange, handleSubmit }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; errors: any; serverError: string | null
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (field: any, value: string) => void
  handleSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <AuthInput
          label="Prénom" value={form.firstName}
          onChange={v => handleChange('firstName', v)}
          placeholder="Jean" error={errors.firstName}
          autoComplete="given-name" autoFocus
        />
        <AuthInput
          label="Nom" value={form.lastName}
          onChange={v => handleChange('lastName', v)}
          placeholder="Dupont" error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      <AuthInput
        label="Email" type="email" value={form.email}
        onChange={v => handleChange('email', v)}
        placeholder="vous@exemple.fr" error={errors.email}
        autoComplete="email"
      />

      <AuthInput
        label="Téléphone" type="tel" value={form.phone}
        onChange={v => handleChange('phone', v)}
        placeholder="06 12 34 56 78" error={errors.phone}
        autoComplete="tel"
      />

      <AuthInput
        label="Mot de passe" type="password" value={form.password}
        onChange={v => handleChange('password', v)}
        placeholder="8 caractères min, 1 majuscule, 1 chiffre"
        error={errors.password} autoComplete="new-password"
      />

      <AuthInput
        label="Confirmer le mot de passe" type="password"
        value={form.confirmPassword}
        onChange={v => handleChange('confirmPassword', v)}
        placeholder="••••••••" error={errors.confirmPassword}
        autoComplete="new-password"
      />

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
          Créer mon compte
        </BtnPrimary>
      </div>

      <p style={{
        marginTop: 12, textAlign: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 13, color: 'rgba(255,255,255,0.35)',
      }}>
        Déjà un compte ?{' '}
        <Link href="/login" style={{
          color: 'rgba(255,255,255,0.75)',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}>
          Se connecter
        </Link>
      </p>

    </form>
  )
}