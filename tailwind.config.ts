import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {

      /* ────────────────────────────────────────────
         POLICES
         Usage : font-display / font-body / font-mono
         ──────────────────────────────────────────── */
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'], // override Tailwind default
      },

      /* ────────────────────────────────────────────
         COULEURS
         Usage : bg-vtc-bg / text-vtc-primary / border-vtc-glass
         ──────────────────────────────────────────── */
      colors: {
        vtc: {
          /* Fonds */
          bg:           '#07090f',
          'bg-elevated':'#0d1117',
          'bg-overlay': '#111827',

          /* Textes */
          primary:      '#ffffff',
          secondary:    'rgba(255, 255, 255, 0.55)',
          muted:        'rgba(255, 255, 255, 0.30)',
          placeholder:  'rgba(255, 255, 255, 0.38)',

          /* Accents */
          accent:       '#ffffff',
          'accent-fg':  '#07090f',
          'accent-dark':'#1c2132',

          /* Surfaces glass */
          glass:        'rgba(255, 255, 255, 0.06)',
          'glass-hover':'rgba(255, 255, 255, 0.10)',
          'glass-active':'rgba(255, 255, 255, 0.13)',

          /* Bordures */
          border:       'rgba(255, 255, 255, 0.10)',
          'border-hover':'rgba(255, 255, 255, 0.18)',
          'border-focus':'rgba(255, 255, 255, 0.30)',

          /* Statuts */
          success:      '#22c55e',
          warning:      '#f59e0b',
          error:        '#ef4444',
          info:         '#3b82f6',
        },

        /* Shadcn attend ces clés (HSL passé via CSS vars) */
        background:   'hsl(var(--background))',
        foreground:   'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        border:   'hsl(var(--border))',
        input:    'hsl(var(--input))',
        ring:     'hsl(var(--ring))',
      },

      /* ────────────────────────────────────────────
         ARRONDIS
         Usage : rounded-vtc-sm / rounded-vtc-xl / rounded-vtc-btn
         ──────────────────────────────────────────── */
      borderRadius: {
        'vtc-xs':   '0.25rem',   // 4px  — badges
        'vtc-sm':   '0.5rem',    // 8px
        'vtc-md':   '0.875rem',  // 14px — cards
        'vtc-lg':   '1.25rem',   // 20px — inputs mobile
        'vtc-xl':   '1.75rem',   // 28px — boutons principaux
        'vtc-2xl':  '2.5rem',    // 40px — modals
        'vtc-btn':  '9999px',    // pill — boutons ronds
        lg:         'var(--radius)',
        md:         'calc(var(--radius) - 2px)',
        sm:         'calc(var(--radius) - 4px)',
      },

      /* ────────────────────────────────────────────
         OMBRES
         Usage : shadow-vtc-sm / shadow-vtc-glow
         ──────────────────────────────────────────── */
      boxShadow: {
        'vtc-xs':   '0 1px 2px rgba(0,0,0,0.35)',
        'vtc-sm':   '0 2px 8px rgba(0,0,0,0.45)',
        'vtc-md':   '0 4px 20px rgba(0,0,0,0.55)',
        'vtc-lg':   '0 8px 40px rgba(0,0,0,0.65)',
        'vtc-xl':   '0 16px 64px rgba(0,0,0,0.75)',
        'vtc-glow': '0 0 0 3px rgba(255,255,255,0.12)',
      },

      /* ────────────────────────────────────────────
         TAILLE DE TEXTE
         Usage : text-vtc-xs / text-vtc-4xl
         ──────────────────────────────────────────── */
      fontSize: {
        'vtc-xs':   ['0.6875rem', { lineHeight: '1rem' }],
        'vtc-sm':   ['0.8125rem', { lineHeight: '1.25rem' }],
        'vtc-base': ['1rem',      { lineHeight: '1.5rem' }],
        'vtc-lg':   ['1.125rem',  { lineHeight: '1.65rem' }],
        'vtc-xl':   ['1.25rem',   { lineHeight: '1.5rem' }],
        'vtc-2xl':  ['1.5rem',    { lineHeight: '1.3rem' }],
        'vtc-3xl':  ['1.875rem',  { lineHeight: '1.2rem' }],
        'vtc-4xl':  ['2.25rem',   { lineHeight: '1.15rem' }],
        'vtc-5xl':  ['3rem',      { lineHeight: '1.1rem' }],
      },

      /* ────────────────────────────────────────────
         TRACKING (letter-spacing)
         Usage : tracking-vtc-tight / tracking-vtc-widest
         ──────────────────────────────────────────── */
      letterSpacing: {
        'vtc-tight':   '-0.03em',
        'vtc-normal':   '0em',
        'vtc-wide':     '0.04em',
        'vtc-widest':   '0.12em',
      },

      /* ────────────────────────────────────────────
         HAUTEURS FIXES (chrome de l'app)
         Usage : h-header-mobile / h-bottom-bar
         ──────────────────────────────────────────── */
      height: {
        'header-mobile':  '56px',
        'header-desktop': '72px',
        'bottom-bar':     '88px',
        screen:           '100dvh',
      },

      minHeight: {
        screen: '100dvh',
      },

      /* ────────────────────────────────────────────
         LARGEURS (sidebar desktop)
         Usage : w-sidebar
         ──────────────────────────────────────────── */
      width: {
        sidebar: '320px',
      },

      /* ────────────────────────────────────────────
         ANIMATIONS
         Usage : animate-fade-up / animate-slide-up
         ──────────────────────────────────────────── */
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { transform: 'translateY(-100%)' },
          to:   { transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },

      animation: {
        'fade-in':   'fade-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up':   'fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-down': 'fade-down 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':  'scale-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up':  'slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down':'slide-down 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-glow':'pulse-glow 2s ease-in-out infinite',
      },

      /* ────────────────────────────────────────────
         TRANSITIONS
         Usage : duration-vtc-base / ease-vtc-smooth
         ──────────────────────────────────────────── */
      transitionDuration: {
        'vtc-instant': '80ms',
        'vtc-fast':    '150ms',
        'vtc-base':    '250ms',
        'vtc-slow':    '400ms',
        'vtc-slower':  '600ms',
      },

      transitionTimingFunction: {
        'vtc-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'vtc-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'vtc-sharp':  'cubic-bezier(0.2, 0, 0, 1)',
      },

      /* ────────────────────────────────────────────
         BACKDROP BLUR
         Usage : backdrop-blur-vtc / backdrop-blur-vtc-heavy
         ──────────────────────────────────────────── */
      backdropBlur: {
        'vtc':       '20px',
        'vtc-heavy': '40px',
        'vtc-light': '8px',
      },

      /* ────────────────────────────────────────────
         Z-INDEX
         Usage : z-map / z-content / z-modal
         ──────────────────────────────────────────── */
      zIndex: {
        map:      '0',
        'map-ui': '10',
        content:  '20',
        header:   '30',
        overlay:  '40',
        modal:    '50',
        toast:    '60',
        tooltip:  '70',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config