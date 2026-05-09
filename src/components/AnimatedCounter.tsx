import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export default function AnimatedCounter({
  value,
  className = '',
  duration = 1.5,
}: AnimatedCounterProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: 'easeOut' })
      return controls.stop
    }
  }, [isInView, value, count, duration])

  return (
    <span ref={ref}>
      <motion.span className={className}>{rounded}</motion.span>
    </span>
  )
}
