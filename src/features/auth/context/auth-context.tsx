'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import type { User } from '@/features/auth/types/auth.types'

const STORAGE_KEY = 'vtc_auth_user'

interface AuthContextValue {
  user:       User | null
  isLoggedIn: boolean
  isLoading:  boolean
  isOwner:    boolean
}

const AuthContext = createContext<AuthContextValue>({
  user:       null,
  isLoggedIn: false,
  isLoading:  true,
  isOwner:    false,
})

/* ── Construit l'user depuis les métadonnées uniquement — 0 requête DB ── */
function buildUserFromSession(su: {
  id: string
  email?: string
  created_at: string
  user_metadata?: Record<string, string>
}): User {
  return {
    id:        su.id,
    email:     su.email ?? '',
    firstName: su.user_metadata?.first_name ?? '',
    lastName:  su.user_metadata?.last_name  ?? '',
    phone:     su.user_metadata?.phone      ?? '',
    role:      su.user_metadata?.role       ?? 'client',
    createdAt: su.created_at,
  }
}

function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch { return null }
}

function writeCachedUser(user: User | null) {
  if (typeof window === 'undefined') return
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else      localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function setAndCache(u: User | null) {
    setUser(u)
    writeCachedUser(u)
  }

  useEffect(() => {
    /* 1. Cache localStorage — immédiat, 0ms */
    const cached = readCachedUser()
    if (cached) {
      setUser(cached)
      setIsLoading(false)
    }

    /* 2. Session Supabase — 1 seule requête réseau */
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAndCache(buildUserFromSession(session.user))
      } else {
        setAndCache(null)
      }
      setIsLoading(false)
    })

    /* 3. Changements temps réel */
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        ) {
          if (session?.user) setAndCache(buildUserFromSession(session.user))
        }
        if (event === 'SIGNED_OUT') {
          setAndCache(null)
        }
        if (event === 'TOKEN_REFRESHED' && !session) {
          setAndCache(null)
          window.location.href = '/login'
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      isLoading,
      isOwner:    user?.role === 'owner',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}