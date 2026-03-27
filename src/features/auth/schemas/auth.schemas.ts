/* ============================================================
   features/auth/schemas/auth.schemas.ts

   Validation avec Zod.
   Utilisé par les hooks — pas dans les composants UI.
   ============================================================ */

import { z } from 'zod'

const phoneRegex = /^(\+33|0)[1-9](\d{8})$/

export const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Prénom trop court')
    .max(50, 'Prénom trop long'),

  lastName: z
    .string()
    .min(2, 'Nom trop court')
    .max(50, 'Nom trop long'),

  email: z
    .string()
    .email('Adresse email invalide'),

  phone: z
    .string()
    .regex(phoneRegex, 'Numéro de téléphone invalide (ex: 06 12 34 56 78)'),

  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),

  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  { message: 'Les mots de passe ne correspondent pas', path: ['confirmPassword'] }
)

export type LoginSchema    = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>