import { useEffect } from 'react'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(InertiaPlugin)

/**
 * Inertial + momentum scrolling powered by GSAP's InertiaPlugin.
 *
 * A single proxy object holds the smoothed scroll position. Wheel and trackpad
 * deltas feed a velocity estimate (px/s); each event restarts an InertiaPlugin
 * tween that eases the proxy to a target with the current momentum, while
 * `min`/`max` bounds keep the page inside the scrollable range. When the input
 * stops, the last tween decelerates on its own, which is the glide you feel.
 *
 * - Touch tracks the finger 1:1 and flings on release using finger velocity.
 * - Keyboard / scrollbar / programmatic scroll resync (no fight).
 * - Anchor links glide to their target.
 * - Respects prefers-reduced-motion (native scrolling).
 */

const RESISTANCE = 400 // lower = longer, floatier glide
const MAX_VELOCITY = 9000 // px/s cap so a hard flick can't launch the page
const CARRY = 0.16 // how much extra distance fast input adds to the target
const TOUCH_FLING_MIN = 120 // px/s below which a finger lift doesn't fling

function scrollLimit(): number {
  const doc = document.scrollingElement || document.documentElement
  return Math.max(0, doc.scrollHeight - window.innerHeight)
}

export function useInertialScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const proxy = { y: window.scrollY }
    let tween: gsap.core.Tween | null = null
    let velocity = 0
    let lastEventTime = performance.now()
    let touching = false
    let lastTouchY = 0
    let lastTouchTime = performance.now()

    const clamp = (v: number) => Math.min(scrollLimit(), Math.max(0, v))

    const apply = () => {
      if (Math.abs(window.scrollY - proxy.y) > 0.5) window.scrollTo(0, proxy.y)
    }

    const stop = () => {
      if (tween) {
        tween.kill()
        tween = null
      }
    }

    const glide = (opts: {
      velocity: number
      end?: number
    }) => {
      stop()
      tween = gsap.to(proxy, {
        inertia: {
          resistance: RESISTANCE,
          y: {
            velocity: opts.velocity,
            min: 0,
            max: scrollLimit(),
            ...(opts.end !== undefined ? { end: clamp(opts.end) } : {}),
          },
        },
        onUpdate: apply,
      })
    }

    const isInBoard = (target: EventTarget | null) =>
      (target as HTMLElement)?.closest?.('[data-nopan], .board-chrome, [data-board-content]') != null

    const onWheel = (e: WheelEvent) => {
      if (isInBoard(e.target)) return
      if (scrollLimit() <= 0) return
      e.preventDefault()
      const mul =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      const delta = e.deltaY * mul

      const now = performance.now()
      const dt = Math.max(1, now - lastEventTime)
      lastEventTime = now

      const inst = (delta / dt) * 1000
      // Accumulate velocity in the same direction, reset on reversal.
      velocity =
        Math.sign(inst) === Math.sign(velocity) || velocity === 0
          ? velocity * 0.5 + inst * 0.5
          : inst
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity))

      const end = proxy.y + delta + velocity * CARRY
      glide({ velocity, end })
    }

    const onTouchStart = (e: TouchEvent) => {
      if (isInBoard(e.target)) return
      touching = true
      stop()
      const t = e.touches[0]
      lastTouchY = t?.clientY ?? 0
      lastTouchTime = performance.now()
      proxy.y = window.scrollY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (isInBoard(e.target)) return
      if (!touching || scrollLimit() <= 0) return
      e.preventDefault()
      const t = e.touches[0]
      if (!t) return
      const now = performance.now()
      const dtMs = Math.max(1, now - lastTouchTime)
      const delta = lastTouchY - t.clientY
      lastTouchY = t.clientY
      lastTouchTime = now
      velocity = (delta / dtMs) * 1000
      proxy.y = clamp(proxy.y + delta)
      apply()
    }

    const onTouchEnd = () => {
      touching = false
      if (Math.abs(velocity) < TOUCH_FLING_MIN) return
      glide({ velocity })
    }

    // External scroll (keyboard, scrollbar, programmatic) resyncs and cancels
    // any running tween. Our own writes are ignored via the value comparison.
    const onScroll = () => {
      if (Math.abs(window.scrollY - proxy.y) < 1) return
      stop()
      velocity = 0
      proxy.y = window.scrollY
    }

    const onResize = () => {
      proxy.y = Math.min(proxy.y, scrollLimit())
    }

    const onClick = (e: MouseEvent) => {
      // Demo chalkboard is an isolated interaction surface — no anchor glide, no
      // scroll hijack. This prevents the “click chat → jump to top” friction.
      if (isInBoard(e.target)) return
      // Respect anchors whose default was already handled by React (e.g. the
      // navbar view-switch), so the two systems don't both act on one click.
      if (e.defaultPrevented) return
      const el = e.target as HTMLElement | null
      const anchor = el?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const destination = document.querySelector(hash)
      if (!destination) return
      e.preventDefault()
      const end = destination.getBoundingClientRect().top + window.scrollY
      glide({ velocity: 0, end })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('click', onClick)
      stop()
    }
  }, [])
}
