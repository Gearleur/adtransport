'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/* ============================================================
   features/auth/components/auth-input.tsx

   Input générique pour les formulaires auth.
   Gère : texte, email, password (avec toggle visible), tel
   ============================================================ */

interface AuthInputProps {
  label:       string
  type?:       'text' | 'email' | 'password' | 'tel'
  value:       string
  onChange:    (value: string) => void
  placeholder?: string
  error?:      string
  autoComplete?: string
  autoFocus?:  boolean
}

export function AuthInput({
  label, type = 'text', value, onChange,
  placeholder, error, autoComplete, autoFocus,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <>
      <style>{`
        .auth-input {
          width: 100%; background: transparent; border: none; outline: none;
          color: #ffffff; font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px; padding: 0; flex: 1;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.28); }
        .auth-input-wrap {
          display: flex; align-items: center; gap: 10px;
          height: 54px; padding: 0 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .auth-input-wrap:focus-within {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.07);
        }
        .auth-input-wrap.has-error {
          border-color: rgba(239,68,68,0.5);
          background: rgba(239,68,68,0.04);
        }
        .toggle-pw {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.35); display: flex; align-items: center;
          padding: 0; transition: color 150ms ease; flex-shrink: 0;
        }
        .toggle-pw:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Label */}
        <label style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.03em',
        }}>
          {label}
        </label>

        {/* Input */}
        <div className={`auth-input-wrap${error ? ' has-error' : ''}`}>
          <input
            className="auth-input"
            type={inputType}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
          {type === 'password' && (
            <button
              type="button"
              className="toggle-pw"
              onClick={() => setShowPassword(s => !s)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 12, color: '#ef4444', marginTop: -2,
          }}>
            {error}
          </p>
        )}
      </div>
    </>
  )
}