/* ============================================================
   features/auth/types/auth.types.ts
   ============================================================ */

/* ── Utilisateur authentifié ── */
export interface User {
  id:        string
  email:     string
  firstName: string
  lastName:  string
  phone:     string
  createdAt: string
}

/* ── État auth global ── */
export interface AuthState {
  user:       User | null
  isLoading:  boolean
  isLoggedIn: boolean
}

/* ── DTOs envoyés à Supabase Auth ── */
export interface LoginDTO {
  email:    string
  password: string
}

export interface RegisterDTO {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  password:  string
}

/* ── État du formulaire (local, avant envoi) ── */
export interface LoginFormState {
  email:    string
  password: string
}

export interface RegisterFormState {
  firstName:       string
  lastName:        string
  email:           string
  phone:           string
  password:        string
  confirmPassword: string
}

/* ── Erreurs de validation ── */
export type LoginFormErrors    = Partial<Record<keyof LoginFormState, string>>
export type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>