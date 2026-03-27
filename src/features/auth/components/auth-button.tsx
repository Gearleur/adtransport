'use client'

import Link from 'next/link'
import { useState } from 'react'
import { User, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/context/auth-context'

export function AuthButton() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      localStorage.removeItem('vtc_auth_user')
    } catch { /* ignore */ }

    /* Appelle la route handler qui efface les cookies côté serveur */
    const res = await fetch('/api/v1/auth/logout', { method: 'POST', redirect: 'manual' })

    /* Full reload vers / dans tous les cas */
    window.location.replace('/')
  }

  return (
    <>
      <style>{`
        .auth-btn-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 9999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.70);
          font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', system-ui, sans-serif;
          text-decoration: none; white-space: nowrap;
          transition: all 150ms ease;
        }
        .auth-btn-link:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .auth-btn-logout {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 9999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.45); cursor: pointer;
          transition: all 150ms ease;
        }
        .auth-btn-logout:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85); }
        .auth-btn-logout:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* Connecté */}
      {!isLoading && isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.70)',
            whiteSpace: 'nowrap',
          }}>
            {user?.firstName}
          </span>
          <button
            className="auth-btn-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Se déconnecter"
          >
            <LogOut size={13} />
          </button>
        </div>
      )}

      {/* Non connecté ou loading */}
      {(isLoading || !isLoggedIn) && (
        <Link
          href="/login"
          className="auth-btn-link"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <User size={13} />
          Se connecter
        </Link>
      )}
    </>
  )
}