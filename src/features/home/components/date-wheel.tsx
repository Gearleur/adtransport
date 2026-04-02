'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]
const DAYS_FR = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa']

const ITEM_W = 56
const ITEM_GAP = 8
const STRIDE = ITEM_W + ITEM_GAP
const MONTHS_AHEAD = 3

const SNAP_DEBOUNCE_MS = 90
const SCROLL_SETTLE_MS = 240
const INTENT_THRESHOLD_PX = 8

interface DateWheelProps {
  rideDates: Set<string>
  selectedDate: string | null
  onSelect: (date: string) => void
}

function formatLocalISO(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildDays() {
  const result: string[] = []
  const now = new Date()

  for (let m = 0; m <= MONTHS_AHEAD; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1)
    const total = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()

    for (let day = 1; day <= total; day++) {
      result.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      )
    }
  }

  return result
}

function findNearestRideIndex(
  fromIdx: number,
  preferredDir: 1 | -1,
  days: string[],
  rideDates: Set<string>,
  fallbackIdx: number
) {
  if (rideDates.has(days[fromIdx])) return fromIdx

  let bestIdx = -1
  let bestDist = Number.POSITIVE_INFINITY

  for (let i = 0; i < days.length; i++) {
    if (!rideDates.has(days[i])) continue

    const dist = Math.abs(i - fromIdx)

    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i
      continue
    }

    if (dist === bestDist && bestIdx >= 0) {
      const currentDelta = i - fromIdx
      const bestDelta = bestIdx - fromIdx

      if (preferredDir === 1 && currentDelta > 0 && bestDelta <= 0) {
        bestIdx = i
      }

      if (preferredDir === -1 && currentDelta < 0 && bestDelta >= 0) {
        bestIdx = i
      }
    }
  }

  return bestIdx >= 0 ? bestIdx : fallbackIdx
}

function findRideIndexInDirection(
  startIdx: number,
  dir: 1 | -1,
  days: string[],
  rideDates: Set<string>
) {
  for (let i = startIdx; i >= 0 && i < days.length; i += dir) {
    if (rideDates.has(days[i])) return i
  }
  return -1
}

export function DateWheel({ rideDates, selectedDate, onSelect }: DateWheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStartLeft = useRef(0)

  const snapping = useRef(false)
  const pendingParentSync = useRef(false)

  const days = useMemo(() => buildDays(), [])
  const todayISO = useMemo(() => formatLocalISO(new Date()), [])
  const todayIdx = Math.max(0, days.findIndex(d => d === todayISO))

  const propIdx = useMemo(() => {
    if (!selectedDate) return -1
    return days.findIndex(d => d === selectedDate)
  }, [selectedDate, days])

  const initialIdx = propIdx >= 0 ? propIdx : todayIdx

  const [activeIdx, setActiveIdx] = useState(initialIdx)

  const prevRideIdx = useMemo(() => {
    for (let i = activeIdx - 1; i >= 0; i--) {
      if (rideDates.has(days[i])) return i
    }
    return -1
  }, [activeIdx, days, rideDates])

  const nextRideIdx = useMemo(() => {
    for (let i = activeIdx + 1; i < days.length; i++) {
      if (rideDates.has(days[i])) return i
    }
    return -1
  }, [activeIdx, days, rideDates])

  const leftForIdx = useCallback((idx: number) => {
    return Math.max(0, idx * STRIDE)
  }, [])

  const clearTimers = useCallback(() => {
    if (stopTimer.current) clearTimeout(stopTimer.current)
    if (unlockTimer.current) clearTimeout(unlockTimer.current)
    if (notifyTimer.current) clearTimeout(notifyTimer.current)
  }, [])

  const unlockSnappingLater = useCallback((delay: number) => {
    if (unlockTimer.current) clearTimeout(unlockTimer.current)
    unlockTimer.current = setTimeout(() => {
      snapping.current = false
    }, delay)
  }, [])

  const scrollViewportToIdx = useCallback((idx: number, smooth = true) => {
    scrollRef.current?.scrollTo({
      left: leftForIdx(idx),
      behavior: smooth ? 'smooth' : 'auto',
    })
  }, [leftForIdx])

  const commitIdx = useCallback((
    idx: number,
    options?: { smooth?: boolean; notifyParent?: boolean }
  ) => {
    const smooth = options?.smooth ?? true
    const notifyParent = options?.notifyParent ?? true

    if (!days[idx]) return

    clearTimers()
    snapping.current = true

    setActiveIdx(idx)
    scrollViewportToIdx(idx, smooth)

    if (notifyParent) {
      pendingParentSync.current = true

      notifyTimer.current = setTimeout(() => {
        onSelect(days[idx])

        setTimeout(() => {
          pendingParentSync.current = false
        }, 0)
      }, smooth ? SCROLL_SETTLE_MS : 0)
    }

    unlockSnappingLater(smooth ? SCROLL_SETTLE_MS + 60 : 50)
  }, [days, clearTimers, onSelect, scrollViewportToIdx, unlockSnappingLater])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      scrollViewportToIdx(initialIdx, false)
    })

    return () => cancelAnimationFrame(raf)
  }, [initialIdx, scrollViewportToIdx])

  useEffect(() => {
    if (pendingParentSync.current) return
    if (propIdx < 0) return
    if (propIdx === activeIdx) return

    const raf = requestAnimationFrame(() => {
      setActiveIdx(propIdx)
      scrollViewportToIdx(propIdx, false)
    })

    return () => cancelAnimationFrame(raf)
  }, [propIdx, activeIdx, scrollViewportToIdx])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  const onScrollStop = useCallback(() => {
    if (snapping.current) return

    const sc = scrollRef.current
    if (!sc) return

    const currentLeft = sc.scrollLeft
    const delta = currentLeft - dragStartLeft.current
    const hasIntent = Math.abs(delta) >= INTENT_THRESHOLD_PX
    const intentDir: 1 | -1 = delta >= 0 ? 1 : -1

    let raw: number

    if (hasIntent) {
      raw = intentDir === 1
        ? Math.ceil(currentLeft / STRIDE)
        : Math.floor(currentLeft / STRIDE)
    } else {
      raw = Math.round(currentLeft / STRIDE)
    }

    let clamped = Math.max(0, Math.min(days.length - 1, raw))

    if (hasIntent && clamped === activeIdx) {
      clamped = Math.max(0, Math.min(days.length - 1, activeIdx + intentDir))
    }

    let target = -1

    if (hasIntent) {
      target = findRideIndexInDirection(clamped, intentDir, days, rideDates)

      if (target < 0) {
        target = findNearestRideIndex(clamped, intentDir, days, rideDates, activeIdx)
      }
    } else {
      target = findNearestRideIndex(clamped, intentDir, days, rideDates, activeIdx)
    }

    if (target === activeIdx) {
      commitIdx(target, { smooth: true, notifyParent: false })
      return
    }

    commitIdx(target, { smooth: true, notifyParent: true })
  }, [days, rideDates, activeIdx, commitIdx])

  const activeDate = days[activeIdx]
    ? new Date(days[activeIdx] + 'T12:00')
    : new Date()

  return (
    <div style={{ width: '100%' }}>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.78)',
          marginBottom: 14,
          textAlign: 'center',
          transition: 'opacity 150ms ease',
        }}
      >
        {MONTHS_FR[activeDate.getMonth()]} {activeDate.getFullYear()}
      </p>

      <div style={{ position: 'relative', width: '100%' }}>
        <style>{`
          .dw-list {
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
            padding: 4px calc(50% - ${ITEM_W / 2}px) 8px;
          }

          .dw-list::-webkit-scrollbar {
            display: none;
          }

          .dw-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: ${ITEM_W}px;
            min-width: ${ITEM_W}px;
            height: 76px;
            border-radius: 9999px;
            border: none;
            background: transparent;
            gap: 2px;
            padding: 8px 6px;
            flex-shrink: 0;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            transition:
              opacity 150ms ease,
              transform 150ms ease;
            position: relative;
            z-index: 2;
            margin-right: ${ITEM_GAP}px;
          }

          .dw-btn:last-child {
            margin-right: 0;
          }

          .dw-fade-l {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 80px;
            background: linear-gradient(to right, #07090f 22%, transparent);
            pointer-events: none;
            z-index: 4;
          }

          .dw-fade-r {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 80px;
            background: linear-gradient(to left, #07090f 22%, transparent);
            pointer-events: none;
            z-index: 4;
          }

          .dw-center-pill {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${ITEM_W}px;
            height: 76px;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.16);
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            pointer-events: none;
            z-index: 1;
          }

          .dw-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 6;
            cursor: pointer;
            transition:
              opacity 160ms ease,
              transform 160ms ease,
              background 160ms ease,
              border-color 160ms ease;
            box-shadow: 0 4px 14px rgba(0,0,0,0.22);
          }

          .dw-arrow:hover {
            background: rgba(255,255,255,0.12);
            border-color: rgba(255,255,255,0.16);
          }

          .dw-arrow:active {
            transform: translateY(-50%) scale(0.96);
          }

          .dw-arrow-left {
            left: 8px;
          }

          .dw-arrow-right {
            right: 8px;
          }

          .dw-arrow-icon {
            font-family: system-ui, sans-serif;
            font-size: 15px;
            font-weight: 700;
            line-height: 1;
            color: rgba(255,255,255,0.78);
            transform: translateY(-1px);
          }

          .dw-arrow-dot {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 5px;
            height: 5px;
            border-radius: 9999px;
            background: #60a5fa;
            box-shadow: 0 0 10px rgba(96,165,250,0.35);
          }
        `}</style>

        <div className="dw-center-pill" />
        <div className="dw-fade-l" />
        <div className="dw-fade-r" />

        {prevRideIdx >= 0 && (
          <button
            type="button"
            className="dw-arrow dw-arrow-left"
            aria-label="Aller à la course précédente"
            onClick={() => commitIdx(prevRideIdx, { smooth: true, notifyParent: true })}
          >
            <span className="dw-arrow-icon">‹</span>
            <span className="dw-arrow-dot" />
          </button>
        )}

        {nextRideIdx >= 0 && (
          <button
            type="button"
            className="dw-arrow dw-arrow-right"
            aria-label="Aller à la course suivante"
            onClick={() => commitIdx(nextRideIdx, { smooth: true, notifyParent: true })}
          >
            <span className="dw-arrow-icon">›</span>
            <span className="dw-arrow-dot" />
          </button>
        )}

        <div
          className="dw-list"
          ref={scrollRef}
          onPointerDown={() => {
            snapping.current = false
            clearTimers()
            dragStartLeft.current = scrollRef.current?.scrollLeft ?? 0
          }}
          onTouchStart={() => {
            snapping.current = false
            clearTimers()
            dragStartLeft.current = scrollRef.current?.scrollLeft ?? 0
          }}
          onScroll={() => {
            if (stopTimer.current) clearTimeout(stopTimer.current)
            stopTimer.current = setTimeout(onScrollStop, SNAP_DEBOUNCE_MS)
          }}
        >
          {days.map((iso, idx) => {
            const d = new Date(iso + 'T12:00')
            const isAct = activeIdx === idx
            const isToday = iso === todayISO
            const hasRide = rideDates.has(iso)
            const isPast = iso < todayISO
            const dist = Math.abs(idx - activeIdx)
            const fade = Math.max(0.15, 1 - dist * 0.22)

            return (
              <button
                key={iso}
                className="dw-btn"
                onClick={() => {
                  if (!hasRide) return
                  commitIdx(idx, { smooth: true, notifyParent: true })
                }}
                style={{
                  cursor: hasRide ? 'pointer' : 'default',
                  opacity: isPast && !hasRide && !isToday ? 0.18 : 1,
                  transform: isAct ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    color: isAct
                      ? 'rgba(255,255,255,0.92)'
                      : `rgba(255,255,255,${(fade * 0.4).toFixed(2)})`,
                    transition: 'color 150ms ease',
                  }}
                >
                  {DAYS_FR[d.getDay()]}
                </span>

                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: isAct
                      ? '#ffffff'
                      : hasRide
                        ? `rgba(147,197,253,${(0.3 + fade * 0.7).toFixed(2)})`
                        : `rgba(255,255,255,${(0.15 + fade * 0.4).toFixed(2)})`,
                    transition: 'color 150ms ease',
                  }}
                >
                  {d.getDate()}
                </span>

                {hasRide && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 9999,
                      background: '#60a5fa',
                      opacity: isAct ? 1 : 0.5 + fade * 0.5,
                      transition: 'opacity 150ms ease',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}