import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 md:right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(34,197,94,0.15))',
        border: '1px solid rgba(57,255,20,0.35)',
        boxShadow: '0 4px 20px rgba(57,255,20,0.15), 0 0 30px rgba(57,255,20,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Info size={20} style={{ color: 'var(--ritual-neon)' }} />
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          background: 'rgba(57,255,20,0.1)',
          animationDuration: '2s',
        }}
      />
    </motion.button>
  )
}
