/* ============================================================
   features/profile/services/passenger.service.ts
   ============================================================ */

import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Passenger {
  id:         string
  user_id:    string
  first_name: string
  last_name:  string
  phone:      string
  note:       string | null
  is_default: boolean
  created_at: string
}

export interface CreatePassengerDTO {
  first_name: string
  last_name:  string
  phone:      string
  note:       string | null
  is_default: boolean
}

export async function getPassengers(userId: string): Promise<Passenger[]> {
  const { data, error } = await supabase
    .from('passengers')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) return []
  return data as Passenger[]
}

export async function createPassenger(
  userId: string,
  dto: CreatePassengerDTO
): Promise<{ passenger: Passenger | null; error: string | null }> {
  /* Si is_default → retirer l'ancien default */
  if (dto.is_default) {
    await supabase
      .from('passengers')
      .update({ is_default: false })
      .eq('user_id', userId)
  }

  const { data, error } = await supabase
    .from('passengers')
    .insert({ ...dto, user_id: userId })
    .select()
    .single()

  if (error) return { passenger: null, error: error.message }
  return { passenger: data as Passenger, error: null }
}

export async function updatePassenger(
  passengerId: string,
  userId: string,
  dto: Partial<CreatePassengerDTO>
): Promise<{ error: string | null }> {
  if (dto.is_default) {
    await supabase
      .from('passengers')
      .update({ is_default: false })
      .eq('user_id', userId)
  }

  const { error } = await supabase
    .from('passengers')
    .update(dto)
    .eq('id', passengerId)
    .eq('user_id', userId)

  return { error: error ? error.message : null }
}

export async function deletePassenger(
  passengerId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('passengers')
    .delete()
    .eq('id', passengerId)
    .eq('user_id', userId)

  return { error: error ? error.message : null }
}