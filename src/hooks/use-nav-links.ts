'use client'

/* ============================================================
   hooks/use-nav-links.ts

   Centralise la logique de navigation selon l'état auth.
   Utilisé par BottomNav, TopNav, HeroPanel, BookingPanel.
   ============================================================ */

import { useAuth } from '@/features/auth/context/auth-context'

export function useNavLinks() {
  const { isLoggedIn } = useAuth()

  return {
    home:    isLoggedIn ? '/home'    : '/',
    booking: isLoggedIn ? '/reserver': '/login?redirect=/reserver',
    profile: isLoggedIn ? '/profil'  : '/login?redirect=/profil',
  }
}