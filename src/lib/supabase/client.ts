/* ============================================================
   lib/supabase/client.ts

   Client Supabase côté navigateur avec stockage en cookies.
   Utilise @supabase/ssr pour que le proxy puisse lire la session.
   ============================================================ */

import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env/env'

export const supabaseClient = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)