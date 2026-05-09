import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Copy, Check, Globe, Database, Radio, Trash2 } from 'lucide-react'
import { CONTRACT_ADDRESS, RITUAL_CHAIN_CONFIG } from '@/lib/constants'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [copied, setCopied] = useState(false)
  const [copiedRpc, setCopiedRpc] = useState(false)

  const copyContract = useCallback(async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const copyRpc = useCallback(async () => {
    await navigator.clipboard.writeText(RITUAL_CHAIN_CONFIG.rpcUrls.default.http[0])
    setCopiedRpc(true)
    setTimeout(() => setCopiedRpc(false), 2000)
  }, [])

  const clearLocalData = useCallback(() => {
    localStorage.removeItem('ritual_wallet_address')
    window.location.reload()
  }, [])

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
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(57,255,20,0.4), transparent)',
              }}
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
            <div className="p-8">
              {/* Title */}
              <h2
                className="text-xl font-medium mb-6"
                style={{ color: 'var(--ritual-text-primary)' }}
              >
                Settings
              </h2>

              {/* Contract Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database size={16} style={{ color: 'var(--ritual-neon)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--ritual-text-secondary)' }}>
                    Contract
                  </span>
                </div>

                {/* Contract Address */}
                <div className="glass p-3 rounded-lg mb-3">
                  <p className="caption-text mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="mono-label text-xs break-all flex-1">{CONTRACT_ADDRESS}</code>
                    <button
                      onClick={copyContract}
                      className="p-1.5 rounded-md transition-colors hover:bg-[var(--ritual-glass-hover)] shrink-0"
                      style={{ color: 'var(--ritual-text-tertiary)' }}
                      title="Copy address"
                    >
                      {copied ? <Check size={14} className="text-[var(--ritual-success)]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* View on Explorer */}
                <a
                  href={`https://explorer.ritualfoundation.org/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass-secondary w-full text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  View Contract on Explorer
                </a>
              </div>

              {/* Network Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Radio size={16} style={{ color: 'var(--ritual-neon)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--ritual-text-secondary)' }}>
                    Network
                  </span>
                </div>

                <div className="glass p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="caption-text">Network</span>
                    <span className="text-sm" style={{ color: 'var(--ritual-text-primary)' }}>
                      {RITUAL_CHAIN_CONFIG.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="caption-text">Chain ID</span>
                    <span className="text-sm" style={{ color: 'var(--ritual-text-primary)' }}>
                      {RITUAL_CHAIN_CONFIG.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="caption-text">RPC URL</span>
                    <div className="flex items-center gap-2">
                      <span className="mono-label text-xs truncate max-w-[180px]">
                        {RITUAL_CHAIN_CONFIG.rpcUrls.default.http[0]}
                      </span>
                      <button
                        onClick={copyRpc}
                        className="p-1 rounded transition-colors hover:bg-[var(--ritual-glass-hover)]"
                        style={{ color: 'var(--ritual-text-tertiary)' }}
                      >
                        {copiedRpc ? <Check size={12} className="text-[var(--ritual-success)]" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="caption-text">Currency</span>
                    <span className="text-sm" style={{ color: 'var(--ritual-text-primary)' }}>
                      {RITUAL_CHAIN_CONFIG.nativeCurrency.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explorer Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} style={{ color: 'var(--ritual-neon)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--ritual-text-secondary)' }}>
                    Explorer
                  </span>
                </div>
                <a
                  href="https://explorer.ritualfoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass-secondary w-full text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  Open Ritual Explorer
                </a>
              </div>

              {/* Danger Zone */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 size={16} style={{ color: '#ef4444' }} />
                  <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
                    Local Data
                  </span>
                </div>
                <button
                  onClick={clearLocalData}
                  className="w-full py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                >
                  Clear Wallet & Reset
                </button>
                <p className="caption-text mt-2">
                  This will disconnect your wallet and refresh the page.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
