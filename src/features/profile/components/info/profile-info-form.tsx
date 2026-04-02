'use client'

/* ============================================================
   features/profile/components/profile-info-form.tsx
   Formulaire édition nom + téléphone
   ============================================================ */

import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { UserProfile, UpdateProfileDTO } from '../../services/profile.service'

interface ProfileInfoFormProps {
  profile:  UserProfile
  isSaving: boolean
  success:  boolean
  error:    string | null
  onSave:   (dto: UpdateProfileDTO) => void
}

export function ProfileInfoForm({ profile, isSaving, success, error, onSave }: ProfileInfoFormProps) {
  const [firstName, setFirstName] = useState(profile.first_name)
  const [lastName,  setLastName]  = useState(profile.last_name)
  const [phone,     setPhone]     = useState(profile.phone)

  useEffect(() => {
    setFirstName(profile.first_name)
    setLastName(profile.last_name)
    setPhone(profile.phone)
  }, [profile])

  const isDirty = firstName !== profile.first_name
    || lastName !== profile.last_name
    || phone    !== profile.phone

  return (
    <>
      <style>{`
        .pf-input {
          width: 100%; height: 48px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 0 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; color: #ffffff;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .pf-input:focus { border-color: rgba(255,255,255,0.25); }
        .pf-input::placeholder { color: rgba(255,255,255,0.25); }
        .pf-input:disabled {
          opacity: 0.45; cursor: not-allowed;
          background: rgba(255,255,255,0.02);
        }
        .pf-label {
          display: block;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.30);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 7px;
        }
        .pf-save-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 22px; border-radius: 9999px; border: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 150ms ease;
        }
        .pf-save-btn.active {
          background: #ffffff; color: #07090f;
        }
        .pf-save-btn.inactive {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.30);
          cursor: not-allowed;
        }
        .pf-save-btn.saved {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.25);
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Nom + Prénom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="pf-label">Prénom</label>
            <input
              className="pf-input"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Prénom"
            />
          </div>
          <div>
            <label className="pf-label">Nom</label>
            <input
              className="pf-input"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Nom"
            />
          </div>
        </div>

        {/* Email — non modifiable */}
        <div>
          <label className="pf-label">Email</label>
          <input
            className="pf-input"
            value={profile.email}
            disabled
            readOnly
          />
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.22)',
            marginTop: 5,
          }}>
            L’email ne peut pas être modifié.
          </p>
        </div>

        {/* Téléphone */}
        <div>
          <label className="pf-label">Téléphone</label>
          <input
            className="pf-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+33 6 00 00 00 00"
            type="tel"
          />
        </div>

        {/* Erreur */}
        {error && (
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: '#f87171',
          }}>
            {error}
          </p>
        )}

        {/* Bouton save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className={`pf-save-btn ${success ? 'saved' : isDirty && !isSaving ? 'active' : 'inactive'}`}
            disabled={!isDirty || isSaving}
            onClick={() => onSave({ first_name: firstName, last_name: lastName, phone })}
          >
            {isSaving ? (
              <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : success ? (
              <Check size={14} />
            ) : null}
            {success ? 'Sauvegardé' : isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )
}