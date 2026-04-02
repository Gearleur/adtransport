'use client'

/* ============================================================
   features/profile/components/passengers/passenger-form.tsx
   ============================================================ */

import { useState } from 'react'
import { X, Star, Loader2 } from 'lucide-react'
import type { Passenger, CreatePassengerDTO } from '../../services/passenger.service'

interface PassengerFormProps {
  initial?: Passenger | null
  onSave:  (dto: CreatePassengerDTO) => Promise<string | null | undefined>
  onClose: () => void
}

const EMPTY: CreatePassengerDTO = {
  first_name: '', last_name: '', phone: '', note: null, is_default: false,
}

export function PassengerForm({ initial, onSave, onClose }: PassengerFormProps) {
  /* Initialisation directe depuis la prop — pas de useEffect */
  const [form, setForm] = useState<CreatePassengerDTO>(
    initial ? {
      first_name: initial.first_name,
      last_name:  initial.last_name,
      phone:      initial.phone,
      note:       initial.note,
      is_default: initial.is_default,
    } : EMPTY
  )
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSave() {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.phone.trim()) {
      setError('Prénom, nom et téléphone sont requis.')
      return
    }
    setLoading(true)
    const err = await onSave(form)
    setLoading(false)
    if (err) { setError(err); return }
    onClose()
  }

  return (
    <>
      <style>{`
        .pf-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          display: flex; align-items: flex-end;
          animation: pf-fade 200ms ease;
        }
        .pf-sheet {
          width: 100%; max-width: 520px; max-height: 90dvh; overflow-y: auto;
          background: linear-gradient(160deg, #1e2130 0%, #131520 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-bottom: none;
          border-radius: 24px 24px 0 0;
          padding: 0 20px max(110px, calc(env(safe-area-inset-bottom, 0px) + 100px));
        }
        .pf-input {
          width: 100%; height: 48px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 0 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; color: #ffffff;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .pf-input:focus { border-color: rgba(255,255,255,0.25); }
        .pf-input::placeholder { color: rgba(255,255,255,0.25); }
        .pf-textarea {
          width: 100%; min-height: 72px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 12px 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; color: #ffffff; resize: none;
          outline: none; box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .pf-textarea:focus { border-color: rgba(255,255,255,0.25); }
        .pf-textarea::placeholder { color: rgba(255,255,255,0.25); }
        .pf-label {
          display: block;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 7px;
        }
        .pf-save {
          width: 100%; height: 52px;
          border-radius: 14px; border: none; cursor: pointer;
          background: #ffffff; color: #07090f;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 150ms ease;
        }
        .pf-save:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes pf-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pf-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pf-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div className="pf-sheet">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 700, fontSize: 18, color: '#ffffff', letterSpacing: '-0.02em',
            }}>
              {initial ? 'Modifier le passager' : 'Ajouter un passager'}
            </p>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.50)',
            }}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="pf-label">Prénom</label>
                <input className="pf-input" placeholder="Prénom" value={form.first_name}
                  onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div>
                <label className="pf-label">Nom</label>
                <input className="pf-input" placeholder="Nom" value={form.last_name}
                  onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="pf-label">Téléphone</label>
              <input className="pf-input" type="tel" placeholder="+33 6 00 00 00 00"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>

            <div>
              <label className="pf-label">Note (optionnel)</label>
              <textarea className="pf-textarea" placeholder="Ex : Ma mère, Mon collègue..."
                value={form.note ?? ''}
                onChange={e => setForm(p => ({ ...p, note: e.target.value || null }))} />
            </div>

            <button
              onClick={() => setForm(p => ({ ...p, is_default: !p.is_default }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: form.is_default ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.04)',
                outline: form.is_default ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 150ms ease',
              }}
            >
              <Star
                size={16}
                color={form.is_default ? '#fbbf24' : 'rgba(255,255,255,0.30)'}
                fill={form.is_default ? '#fbbf24' : 'none'}
                strokeWidth={2}
              />
              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14, fontWeight: 500,
                color: form.is_default ? '#fbbf24' : 'rgba(255,255,255,0.50)',
              }}>
                Passager par défaut
              </span>
            </button>

            {error && (
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: '#f87171',
              }}>{error}</p>
            )}

            <button className="pf-save" onClick={handleSave} disabled={loading}>
              {loading && <Loader2 size={16} style={{ animation: 'pf-spin 0.8s linear infinite' }} />}
              {loading ? 'Enregistrement...' : initial ? 'Sauvegarder' : 'Ajouter le passager'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}