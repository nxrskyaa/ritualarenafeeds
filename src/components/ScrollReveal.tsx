import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  y?: number
  x?: number
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  y = 30,
  x = 0,
}: ScrollRevealProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true })

  const initial = {
    opacity: 0,
    y: direction === 'up' ? y : direction === 'down' ? -y : 0,
    x: direction === 'left' ? x : direction === 'right' ? -x : 0,
  }

  return (
    <div ref={ref}>
      <motion.div
        initial={initial}
        animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}
