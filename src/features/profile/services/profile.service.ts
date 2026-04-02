/* ============================================================
   features/profile/services/profile.service.ts
   ============================================================ */

import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface UserProfile {
  id:         string
  email:      string
  first_name: string
  last_name:  string
  phone:      string
}

export interface UpdateProfileDTO {
  first_name: string
  last_name:  string
  phone:      string
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, phone')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as UserProfile
}

export async function updateProfile(userId: string, dto: UpdateProfileDTO): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('users')
    .update({
      first_name: dto.first_name,
      last_name:  dto.last_name,
      phone:      dto.phone,
    })
    .eq('id', userId)

  return { error: error ? error.message : null }
}

export async function sendPasswordReset(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })
  return { error: error ? error.message : null }
}