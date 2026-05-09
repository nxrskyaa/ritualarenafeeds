import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X, ExternalLink } from 'lucide-react'
import type { Toast } from '@/types'

interface ToastNotificationProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastNotification({ toasts, onRemove }: ToastNotificationProps) {
  const iconMap = {
    success: <CheckCircle size={18} className="text-[var(--ritual-success)]" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-[var(--ritual-neon)]" />,
  }

  return (
    <div className="fixed top-20 right-4 md:right-8 z-[100] flex flex-col gap-3 max-w-[360px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="glass p-4 flex items-start gap-3"
            style={{ borderLeft: '2px solid var(--ritual-neon)' }}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: 'var(--ritual-text-primary)' }}>
                {toast.message}
              </p>
              {toast.txHash && (
                <a
                  href={`https://explorer.ritualfoundation.org/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 mt-1 hover:underline"
                  style={{ color: 'var(--ritual-neon)' }}
                >
                  View on Explorer <ExternalLink size={10} />
                </a>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 transition-colors hover:text-[var(--ritual-text-primary)]"
              style={{ color: 'var(--ritual-text-tertiary)' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
