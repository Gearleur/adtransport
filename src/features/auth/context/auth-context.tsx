'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import type { User } from '@/features/auth/types/auth.types'

const STORAGE_KEY = 'vtc_auth_user'

interface AuthContextValue {
  user:       User | null
  isLoggedIn: boolean
  isLoading:  boolean
}

const AuthContext = createContext<AuthContextValue>({
  user:       null,
  isLoggedIn: false,
  isLoading:  true,
})

async function buildUser(su: {
  id: string
  email?: string
  created_at: string
  user_metadata?: Record<string, string>
}): Promise<User> {
  const { data: profile } = await supabaseClient
    .from('users')
    .select('first_name, last_name, phone')
    .eq('id', su.id)
    .maybeSingle()

  return {
    id:        su.id,
    email:     su.email ?? '',
    firstName: profile?.first_name ?? su.user_metadata?.first_name ?? '',
    lastName:  profile?.last_name  ?? su.user_metadata?.last_name  ?? '',
    phone:     profile?.phone      ?? su.user_metadata?.phone      ?? '',
    createdAt: su.created_at,
  }
}

/* Lit le cache localStorage — synchrone, disponible immédiatement */
function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writeCachedUser(user: User | null) {
  if (typeof window === 'undefined') return
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else       localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /*
    Toujours null/true côté serveur pour éviter l'hydration mismatch.
    Le cache localStorage est chargé dans useEffect (client uniquement).
  */
  const [user, setUser]           = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function setAndCache(u: User | null) {
    setUser(u)
    writeCachedUser(u)
  }

  useEffect(() => {
    /* 0. Charge le cache localStorage immédiatement (côté client) */
    const cached = readCachedUser()
    if (cached) {
      setUser(cached)
      setIsLoading(false)
    }

    /* 1. Vérifie la session Supabase en arrière-plan */
    supabaseClient.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUser(session.user)
        setAndCache(u)
      } else {
        setAndCache(null)
      }
      setIsLoading(false)
    })

    /* Écoute les changements en temps réel */
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            const u = await buildUser(session.user)
            setAndCache(u)
          }
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
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}