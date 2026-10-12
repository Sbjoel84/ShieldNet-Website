import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'flip' | 'fade'

// Fires once when the element scrolls into view. Falls back to "visible" where IntersectionObserver is missing.
function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold, rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

interface RevealProps {
  children: ReactNode
  variant?: Variant
  /** ms before the transition starts — use for staggering grid items */
  delay?: number
  /** ms */
  duration?: number
  className?: string
  id?: string
  as?: ElementType
}

/** Animates its children into place the first time they scroll into view. */
export function Reveal({ children, variant = 'up', delay = 0, duration = 800, className, id, as: Tag = 'div' }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const style = { '--reveal-delay': `${delay}ms`, '--reveal-duration': `${duration}ms` } as CSSProperties

  return (
    <Tag ref={ref} id={id} data-variant={variant} style={style} className={cn('reveal', inView && 'is-visible', className)}>
      {children}
    </Tag>
  )
}

/** Counts a stat like "2,400+", "98%" or "₦120B+" up from zero once it scrolls into view. */
export function CountUp({ value, duration = 1800, className }: { value: string; duration?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4)
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/)
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || !match) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setCurrent(target); return }
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setCurrent(target * (1 - Math.pow(1 - t, 3))) // ease-out cubic
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span className={className}>{value}</span>
  const [, prefix, , suffix] = match
  return (
    <span ref={ref} className={className}>
      {prefix}{Math.round(current).toLocaleString('en-US')}{suffix}
    </span>
  )
}
