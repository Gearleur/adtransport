'use client'

/* ============================================================
   features/profile/hooks/use-profile.ts
   ============================================================ */

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/context/auth-context'
import { getProfile, updateProfile, type UserProfile, type UpdateProfileDTO } from '../services/profile.service'

interface UseProfileResult {
  profile:   UserProfile | null
  isLoading: boolean
  isSaving:  boolean
  error:     string | null
  success:   boolean
  save:      (dto: UpdateProfileDTO) => Promise<void>
}

export function useProfile(): UseProfileResult {
  const { user, isLoading: authLoading } = useAuth()
  const [profile,   setProfile]   = useState<UserProfile | null>(null)
  const [isLoading, setLoading]   = useState(true)
  const [isSaving,  setSaving]    = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  useEffect(() => {
    if (authLoading) return
    let cancelled = false

    async function load() {
      if (!user) { setLoading(false); return }
      setLoading(true)
      const data = await getProfile(user.id)
      if (!cancelled) { setProfile(data); setLoading(false) }
    }

    load()
    return () => { cancelled = true }
  }, [user, authLoading])

  const save = useCallback(async (dto: UpdateProfileDTO) => {
    if (!user) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await updateProfile(user.id, dto)

    setSaving(false)
    if (error) { setError(error) }
    else {
      setSuccess(true)
      setProfile(prev => prev ? { ...prev, ...dto } : prev)
      setTimeout(() => setSuccess(false), 3000)
    }
  }, [user])

  return { profile, isLoading, isSaving, error, success, save }
}