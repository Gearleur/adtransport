/* ============================================================
   features/auth/services/auth.service.ts
   ============================================================ */

import { supabaseClient } from '@/lib/supabase/client'
import type { LoginDTO, RegisterDTO, User } from '../types/auth.types'

/* ── Connexion ── */
export async function login(
  dto: LoginDTO
): Promise<{ user: User; error: null } | { user: null; error: string }> {

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email:    dto.email,
    password: dto.password,
  })

  if (error || !data.user) {
    console.error('[auth] login error:', error?.message)
    return { user: null, error: 'Email ou mot de passe incorrect' }
  }

  /* Récupère le profil — peut être absent si créé avant le trigger */
  const { data: profile } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle()  // maybeSingle = pas d'erreur si absent

  const user: User = {
    id:        data.user.id,
    email:     data.user.email ?? '',
    firstName: profile?.first_name ?? data.user.user_metadata?.first_name ?? '',
    lastName:  profile?.last_name  ?? data.user.user_metadata?.last_name  ?? '',
    phone:     profile?.phone      ?? data.user.user_metadata?.phone      ?? '',
    createdAt: data.user.created_at,
  }

  return { user, error: null }
}

/* ── Inscription ── */
/* Le trigger Supabase gère l'insert dans public.users automatiquement */
export async function register(
  dto: RegisterDTO
): Promise<{ user: User; error: null } | { user: null; error: string }> {

  const { data, error } = await supabaseClient.auth.signUp({
    email:    dto.email,
    password: dto.password,
    options: {
      data: {
        first_name: dto.firstName,
        last_name:  dto.lastName,
        phone:      dto.phone,
      },
    },
  })

  if (error) {
    console.error('[auth] register error:', error.message)
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      return { user: null, error: 'Un compte existe déjà avec cet email' }
    }
    return { user: null, error: 'Erreur lors de la création du compte' }
  }

  if (!data.user) {
    return { user: null, error: 'Erreur lors de la création du compte' }
  }

  /* Si confirmation email requise, data.session est null — c'est normal */
  const user: User = {
    id:        data.user.id,
    email:     dto.email,
    firstName: dto.firstName,
    lastName:  dto.lastName,
    phone:     dto.phone,
    createdAt: data.user.created_at,
  }

  return { user, error: null }
}

/* ── Déconnexion ── */
export async function logout(): Promise<void> {
  await supabaseClient.auth.signOut()
}

/* ── Session courante ── */
export async function getSession(): Promise<User | null> {
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id:        user.id,
    email:     user.email ?? '',
    firstName: profile?.first_name ?? user.user_metadata?.first_name ?? '',
    lastName:  profile?.last_name  ?? user.user_metadata?.last_name  ?? '',
    phone:     profile?.phone      ?? user.user_metadata?.phone      ?? '',
    createdAt: user.created_at,
  }
}