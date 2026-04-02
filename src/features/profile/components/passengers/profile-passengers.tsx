'use client'

/* ============================================================
   features/profile/components/profile-passengers.tsx
   Gestion des passagers sauvegardés
   ============================================================ */

import { useState } from 'react'
import { Plus, Star, Pencil, Trash2, Phone } from 'lucide-react'
import { PassengerForm } from './passenger-form'
import { usePassengers } from '../../hooks/use-passengers'
import type { Passenger } from '../../services/passenger.service'

export function ProfilePassengers() {
  const { passengers, isLoading, add, update, remove } = usePassengers()
  const [open,    setOpen]    = useState(false)
  const [editing, setEditing] = useState<Passenger | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  function openAdd()          { setEditing(null); setOpen(true) }
  function openEdit(p: Passenger) { setEditing(p);    setOpen(true) }

  async function handleSave(dto: Parameters<typeof add>[0]) {
    if (editing) return update(editing.id, dto)
    return add(dto)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await remove(id)
    setDeleting(null)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2].map(i => (
              <div key={i} style={{
                height: 72, borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                animation: 'sk-pulse 1.8s ease-in-out infinite',
              }} />
            ))}
            <style>{`@keyframes sk-pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
          </div>
        ) : passengers.length === 0 ? (
          <div style={{
            padding: '28px 20px', textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.10)',
            borderRadius: 16,
          }}>
            <p style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.28)',
              lineHeight: 1.6, marginBottom: 12,
            }}>
              Aucun passager enregistré.<br />
              Ajoutez vos proches pour réserver rapidement.
            </p>
          </div>
        ) : (
          passengers.map(p => (
            <PassengerRow
              key={p.id}
              passenger={p}
              onEdit={() => openEdit(p)}
              onDelete={() => handleDelete(p.id)}
              isDeleting={deleting === p.id}
            />
          ))
        )}

        {/* Bouton ajouter */}
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', height: 46, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            outline: '1px dashed rgba(255,255,255,0.12)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.40)',
            transition: 'all 150ms ease',
          }}
        >
          <Plus size={15} strokeWidth={2} />
          Ajouter un passager
        </button>
      </div>

      {open && (
        <PassengerForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setOpen(false); setEditing(null) }}
        />
      )}
    </>
  )
}

interface PassengerRowProps {
  passenger:  Passenger
  onEdit:     () => void
  onDelete:   () => void
  isDeleting: boolean
}

function PassengerRow({ passenger, onEdit, onDelete, isDeleting }: PassengerRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      transition: 'opacity 150ms ease',
      opacity: isDeleting ? 0.4 : 1,
    }}>
      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: 9999, flexShrink: 0,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.60)',
      }}>
        {passenger.first_name[0].toUpperCase()}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14, fontWeight: 600, color: '#ffffff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {passenger.first_name} {passenger.last_name}
          </p>
          {passenger.is_default && (
            <Star size={11} color="#fbbf24" fill="#fbbf24" strokeWidth={2} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Phone size={10} color="rgba(255,255,255,0.28)" strokeWidth={2} />
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 12, color: 'rgba(255,255,255,0.40)',
          }}>
            {passenger.phone}
          </span>
          {passenger.note && (
            <span style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.25)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              · {passenger.note}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onEdit} style={{
          width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.45)', transition: 'all 150ms ease',
        }}>
          <Pencil size={13} strokeWidth={2} />
        </button>
        <button onClick={onDelete} disabled={isDeleting} style={{
          width: 32, height: 32, borderRadius: 9999, border: 'none', cursor: 'pointer',
          background: 'rgba(248,113,113,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(248,113,113,0.60)', transition: 'all 150ms ease',
        }}>
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}