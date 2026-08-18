import { useEffect, useRef } from 'react'

/**
 * Custom borderless scrollbar that replaces the native one (hidden in CSS).
 *
 * - Reads the live scroll position each frame, so it tracks the GSAP-driven
 *   inertia glide smoothly (position is mirrored from window.scrollY).
 * - Draggable: pointer down on the track jumps, dragging the thumb scrolls 1:1.
 * - Hidden on touch/mobile where it is unnecessary.
 */

const THUMB_MIN = 44

function scrollMetrics() {
  const doc = document.documentElement
  const max = Math.max(0, doc.scrollHeight - window.innerHeight)
  const vh = window.innerHeight
  const thumb =
    max > 0 ? Math.max(THUMB_MIN, vh * (vh / Math.max(doc.scrollHeight, vh))) : 0
  return { max, vh, thumb }
}

export default function Scrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const thumb = thumbRef.current
      if (thumb) {
        const { max, vh, thumb: thumbH } = scrollMetrics()
        if (max <= 0) {
          thumb.style.opacity = '0'
          raf = requestAnimationFrame(update)
          return
        }
        thumb.style.opacity = '1'
        const progress = Math.min(1, window.scrollY / max)
        const top = progress * (vh - thumbH)
        thumb.style.height = `${thumbH}px`
        thumb.style.transform = `translateY(${top}px)`
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  const scrollToPointer = (clientY: number) => {
    const { max, vh, thumb: thumbH } = scrollMetrics()
    if (max <= 0) return
    const usable = vh - thumbH
    const progress = usable > 0 ? (clientY - thumbH / 2) / usable : 0
    window.scrollTo(0, Math.min(max, Math.max(0, progress * max)))
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    trackRef.current?.setPointerCapture(e.pointerId)
    scrollToPointer(e.clientY)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons & 1) scrollToPointer(e.clientY)
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="fixed right-0 top-0 z-50 hidden h-full w-4 cursor-pointer md:block"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className="absolute right-[6px] top-0 w-[3px] bg-white/70"
      />
    </div>
  )
}
