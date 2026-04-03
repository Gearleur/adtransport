'use client'

import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/branding/logo'
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttons'
import { AuthButton } from '@/features/auth/components/auth-button'
import { LocationInputs } from './location-inputs'

const UI_DELAY   = 800
const SPEED      = 0.95
const FADE_MS    = 800   // durée du cross-fade
const PRELOAD_S  = 0.5     // secondes avant la fin de l'intro où on lance le loop

export function HeroMobile() {
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef  = useRef<HTMLVideoElement>(null)
  const [showLoop, setShowLoop] = useState(false)
  const [uiReady,  setUiReady]  = useState(false)
  const loopStarted = useRef(false)

  useEffect(() => {
    const intro = introRef.current
    const loop  = loopRef.current
    if (!intro || !loop) return

    intro.playbackRate = SPEED
    loop.playbackRate  = SPEED

    intro.play().catch(() => {
      /* Autoplay bloqué → switch direct */
      loop?.play().catch(() => {})
      setShowLoop(true)
    })

    /* Lance le loop X secondes avant la fin de l'intro */
    function onTimeUpdate() {
      if (!intro || loopStarted.current) return
      const remaining = (intro.duration - intro.currentTime) / SPEED
      if (remaining <= PRELOAD_S) {
        loopStarted.current = true
        loop?.play().catch(() => {})
      }
    }

    /* Switch d'opacité à la fin de l'intro */
    function onEnded() {
      setShowLoop(true)
    }

    intro.addEventListener('timeupdate', onTimeUpdate)
    intro.addEventListener('ended', onEnded)

    const t = setTimeout(() => setUiReady(true), UI_DELAY)

    return () => {
      intro.removeEventListener('timeupdate', onTimeUpdate)
      intro.removeEventListener('ended', onEnded)
      clearTimeout(t)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes hm-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hm-item {
          opacity: 0;
          animation: hm-fadeup 600ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07090f', overflow: 'hidden' }}>

        {/* Intro — disparaît après */}
        <video
          ref={introRef}
          src="/videos/intro.mp4"
          muted playsInline
          preload="auto"
          poster="/videos/intro-poster.jpg"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'contain',
            zIndex: 2,
            opacity: showLoop ? 0 : 1,
            transform: showLoop ? 'scale(1.05)' : 'scale(1.12)',
            transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
          }}
        />

        {/* Loop — joue en arrière-plan dès le preload, devient visible après l'intro */}
        <video
          ref={loopRef}
          src="/videos/loop.mp4"
          muted playsInline loop
          preload="none"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'contain',
            zIndex: 1,
            transform: 'scale(1.05)',
          }}
        />

        {/* Dégradés */}
        <div style={{
          position: 'absolute', inset: 0, bottom: '45%', zIndex: 10, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(7,9,15,0.95) 0%, rgba(7,9,15,0.65) 50%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, top: '35%', zIndex: 10, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(7,9,15,1) 0%, rgba(7,9,15,0.95) 35%, rgba(7,9,15,0.55) 65%, transparent 100%)',
        }} />

        {/* UI */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '0 20px',
        }}>
          <div style={{ paddingTop: 'max(48px, env(safe-area-inset-top, 16px))' }}>
            {uiReady && (
              <>
                <div className="hm-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 50, animationDelay: '0ms' }}>
                  <Logo size="md" />
                  <AuthButton />
                </div>
                <div className="hm-item" style={{ animationDelay: '80ms' }}>
                  <LocationInputs size="sm" />
                </div>
              </>
            )}
          </div>

          <div style={{ paddingBottom: 'max(110px, calc(env(safe-area-inset-bottom, 0px) + 100px))' }}>
            {uiReady && (
              <>
                <div className="hm-item" style={{ marginBottom: 16, textAlign: 'center', animationDelay: '160ms' }}>
                  <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontWeight: 800, fontSize: 'clamp(2.4rem, 10vw, 3.5rem)',
                    color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.01em',
                  }}>
                    Chauffeur Privé
                  </h1>
                  <p style={{
                    marginTop: 10, color: 'rgba(255,255,255,0.50)', fontSize: 14,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>
                    Paris, en Île-de-France et hauts-de-France
                  </p>
                </div>
                <div className="hm-item" style={{ display: 'flex', flexDirection: 'column', gap: 16, animationDelay: '240ms' }}>
                  <BtnPrimary href="/reserver" fullWidth size="lg">
                    Réserver une course
                  </BtnPrimary>
                  <BtnSecondary href="/services" fullWidth size="lg">
                    Mes services
                  </BtnSecondary>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  )
}