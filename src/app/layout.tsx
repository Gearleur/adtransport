import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/features/auth/context/auth-context"
import { NavLayout } from "@/components/layout/nav-layout"

export const metadata: Metadata = {
  title: "AD Transport",
  description: "Plateforme premium de réservation de trajets",
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <NavLayout>
            {children}
          </NavLayout>
        </AuthProvider>
      </body>
    </html>
  )
}