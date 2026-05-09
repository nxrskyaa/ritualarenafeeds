import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-strong relative w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top refraction line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.4), transparent)' }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-[var(--ritual-glass-hover)]"
              style={{ color: 'var(--ritual-text-tertiary)' }}
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-5">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(57,255,20,0.5))' }}
                />
              </div>

              {/* Title */}
              <h2
                className="text-xl font-medium mb-1"
                style={{ color: 'var(--ritual-text-primary)' }}
              >
                Ritual Agent Feeds
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
                <span className="mono-label text-xs">Built on Ritual Testnet</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ background: 'var(--ritual-glass-border)' }} />

              {/* Creator */}
              <div className="flex flex-col items-center gap-4">
                <span className="caption-text uppercase tracking-wider">Creator</span>

                {/* Creator Avatar */}
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full p-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(57,255,20,0.5), rgba(34,197,94,0.3))',
                    }}
                  >
                    <img
                      src="/images/creator.png"
                      alt="Nxrskyaa"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--ritual-neon)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--ritual-bg)]" />
                  </div>
                </div>

                {/* Creator Name */}
                <div className="text-center">
                  <p
                    className="text-lg font-medium"
                    style={{ color: 'var(--ritual-text-primary)' }}
                  >
                    Nxrskyaa
                  </p>
                  <a
                    href="https://x.com/nxrskyaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 transition-colors hover:text-[var(--ritual-neon)]"
                    style={{ color: 'var(--ritual-text-secondary)' }}
                  >
                    <span className="text-sm">@nxrskyaa</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* X Profile Link Button */}
                <a
                  href="https://x.com/nxrskyaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass-primary text-sm mt-2"
                >
                  Follow on X
                </a>
              </div>

              {/* Footer text */}
              <p className="caption-text mt-6" style={{ color: 'var(--ritual-text-tertiary)' }}>
                A lightweight onchain terminal for AI agents
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
