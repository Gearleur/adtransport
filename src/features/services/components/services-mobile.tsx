/* ============================================================
   features/services/components/services-mobile.tsx
   ============================================================ */

import Link from 'next/link'
import { ArrowLeft, Shield, Plane, GraduationCap, ArrowRight, Phone, Check, PhoneCall } from 'lucide-react'
import { Logo } from '@/components/branding/logo'

const SERVICES = [
  {
    tag:    'Assurances',
    accent: '#60a5fa',
    icon:   <Shield size={20} strokeWidth={1.5} />,
    title:  'Dépannage & assistance',
    desc:   'Intervention rapide pour vos assurés en situation de mobilité d\'urgence.',
    features: ['Disponible 24h/24, 7j/7', 'Réponse en moins de 15 min', 'Facturation directe'],
  },
  {
    tag:    'Entreprises',
    accent: '#a78bfa',
    icon:   <Plane size={20} strokeWidth={1.5} />,
    title:  'Transferts aéroport',
    desc:   'Accueil nominatif, suivi des vols en temps réel. CDG, Orly, Le Bourget.',
    features: ['Suivi des vols', 'Compte entreprise', 'Facturation mensuelle'],
  },
  {
    tag:    'Scolaire',
    accent: '#34d399',
    icon:   <GraduationCap size={20} strokeWidth={1.5} />,
    title:  'Transport scolaire',
    desc:   'Chauffeurs certifiés pour le transport des enfants avec notification aux parents.',
    features: ['Chauffeurs vérifiés', 'Notification SMS', 'Rapport quotidien'],
  },
]

export function ServicesMobile() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#07090f',
      paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom, 0px) + 90px))',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'max(20px, env(safe-area-inset-top, 16px)) 20px 20px',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.80)', textDecoration: 'none', flexShrink: 0,
          }}>
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>
          <Logo size="md" />
        </div>

        {/* Numéro de téléphone */}
        <a href="tel:+33608702683" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.60)',
          textDecoration: 'none', flexShrink: 0,
        }}>
          <Phone size={14} strokeWidth={1.8} color="#4ade80" />
          06 08 70 26 83
        </a>
      </div>

      {/* Contenu */}
      <div style={{ padding: '24px 20px 0' }}>



        {/* Titre */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2rem, 8vw, 2.8rem)',
          color: '#ffffff', lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: 12,
        }}>
          Services<br />
          <span style={{ color: 'rgba(255,255,255,0.30)' }}>professionnels</span>
        </h1>

        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.40)',
          lineHeight: 1.7, marginBottom: 36,
        }}>
          Transport sur-mesure pour entreprises, assurances et établissements scolaires.
        </p>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
          {SERVICES.map(s => (
            <div key={s.tag} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '24px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Lueur */}
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 100, height: 100, borderRadius: 9999,
                background: s.accent, opacity: 0.07, filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />

              {/* Icône + Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.accent, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 11, fontWeight: 500,
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {s.tag}
                </span>
              </div>

              {/* Titre + desc */}
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700, fontSize: 18,
                color: '#ffffff', letterSpacing: '-0.02em',
                lineHeight: 1.2, marginBottom: 8,
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.40)',
                lineHeight: 1.6, marginBottom: 16,
              }}>
                {s.desc}
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {s.features.map(f => (
                  <div key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Check size={12} style={{ color: s.accent, flexShrink: 0 }} strokeWidth={2.5} />
                    <span style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: 12, color: 'rgba(255,255,255,0.50)',
                    }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA mobile */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 24,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 700, fontSize: 20,
            color: '#ffffff', letterSpacing: '-0.02em',
            marginBottom: 8,
          }}>
            Un besoin spécifique ?
          </p>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.6, marginBottom: 20,
          }}>
            Devis personnalisé, contrat sur-mesure.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <style>{`
              .svc-cta-btn {
                display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                height: 50px; border-radius: 9999px;
                font-family: 'DM Sans', system-ui, sans-serif;
                font-size: 14px; font-weight: 600;
                text-decoration: none; transition: all 150ms ease;
              }
              .svc-cta-primary { background: #ffffff; color: #07090f; }
              .svc-cta-secondary {
                background: transparent; color: rgba(255,255,255,0.65);
                border: 1px solid rgba(255,255,255,0.12);
              }
            `}</style>
            <a href="/contact" className="svc-cta-btn svc-cta-primary">
              Demander un devis <ArrowRight size={15} strokeWidth={2} />
            </a>
            <a href="tel:+33600000000" className="svc-cta-btn svc-cta-secondary">
              <Phone size={14} strokeWidth={1.8} /> Nous appeler
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}