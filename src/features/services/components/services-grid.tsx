/* ============================================================
   features/services/components/services-grid.tsx
   ============================================================ */

import { Shield, Plane, GraduationCap } from 'lucide-react'
import { ServiceCard } from './service-card'

const SERVICES = [
  {
    tag:         'Assurances & assistance',
    accent:      '#60a5fa',
    icon:        <Shield size={22} strokeWidth={1.5} />,
    title:       'Dépannage & assistance',
    description: 'Intervention rapide pour vos assurés en situation de mobilité d\'urgence. Nous prenons en charge le transport vers un hôtel, un concessionnaire ou le domicile, en toute discrétion.',
    features: [
      'Disponible 24h/24, 7j/7',
      'Réponse en moins de 15 minutes',
      'Véhicules haut de gamme et confortables',
      'Suivi en temps réel pour votre gestionnaire',
      'Facturation directe à la compagnie',
    ],
  },
  {
    tag:         'Entreprises & VIP',
    accent:      '#a78bfa',
    icon:        <Plane size={22} strokeWidth={1.5} />,
    title:       'Transferts aéroport',
    description: 'Accueil personnalisé, ponctualité garantie. Nous assurons les transferts de vos collaborateurs et clients entre les aéroports de Paris et toute l\'Île-de-France.',
    features: [
      'Suivi des vols en temps réel',
      'Accueil nominatif à l\'arrivée',
      'CDG, Orly, Le Bourget',
      'Facturation mensuelle pour les entreprises',
      'Compte dédié avec historique des courses',
    ],
  },
  {
    tag:         'Établissements scolaires',
    accent:      '#34d399',
    icon:        <GraduationCap size={22} strokeWidth={1.5} />,
    title:       'Transport scolaire',
    description: 'Des chauffeurs certifiés, vérifiés et formés pour le transport des enfants. Trajets domicile-école réguliers ou ponctuels, avec notification aux parents à chaque étape.',
    features: [
      'Chauffeurs vérifiés et formés',
      'Notification SMS aux parents',
      'Trajets récurrents planifiés',
      'Rapport de présence quotidien',
      'Assurance passager incluse',
    ],
  },
]

export function ServicesGrid() {
  return (
    <section style={{ paddingBottom: 80 }}>
      <style>{`
        .svc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 768px) {
          .svc-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="svc-grid">
        {SERVICES.map(s => (
          <ServiceCard key={s.tag} {...s} />
        ))}
      </div>
    </section>
  )
}