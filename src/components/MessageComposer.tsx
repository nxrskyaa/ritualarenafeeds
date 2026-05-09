import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder'
import { useAgentFeed } from '@/hooks/useAgentFeed'
import { FEED_PLACEHOLDERS, MAX_MESSAGE_LENGTH } from '@/lib/constants'
import type { Toast, FeedEntry } from '@/types'
import { generateId } from '@/lib/utils'

interface MessageComposerProps {
  walletConnected: boolean
  walletAddress: string | null
  onSubmit: (entry: FeedEntry) => void
  onToast: (toast: Toast) => void
  connectWallet: () => Promise<string | null>
}

export default function MessageComposer({
  walletConnected,
  walletAddress,
  onSubmit,
  onToast,
  connectWallet,
}: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { postMessage, isPosting } = useAgentFeed()
  const { placeholder, isVisible } = useRotatingPlaceholder(FEED_PLACEHOLDERS, 4000)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = message.length
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH
  const canSubmit = walletConnected && message.trim().length > 0 && !isOverLimit && !isPosting

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return

    if (!walletConnected || !walletAddress) {
      try {
        const addr = await connectWallet()
        if (!addr) {
          onToast({ id: generateId(), type: 'info', message: 'Connect your wallet to post.' })
          return
        }
      } catch (err: unknown) {
        onToast({ id: generateId(), type: 'error', message: (err as Error).message || 'Failed to connect.' })
        return
      }
    }

    try {
      const { hash, entry } = await postMessage(message.trim())
      onSubmit(entry)
      onToast({ id: generateId(), type: 'success', message: 'Posted onchain!', txHash: hash })
      setMessage('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1500)
    } catch (err: unknown) {
      onToast({ id: generateId(), type: 'error', message: (err as Error).message || 'Transaction failed.' })
    }
  }, [canSubmit, walletConnected, walletAddress, connectWallet, message, postMessage, onSubmit, onToast])

  return (
    <div
      id="compose"
      className="glass p-5 md:p-6 relative glass-refraction mb-8"
      style={{ border: '1px solid rgba(57,255,20,0.1)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium" style={{ color: 'var(--ritual-text-primary)' }}>
          New Message
        </h3>
        <span className={`caption-text ${isOverLimit ? 'text-red-400' : ''}`}>
          {charCount} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!message && (
            <motion.div
              key={placeholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-3 left-3 pointer-events-none text-sm"
              style={{ color: 'var(--ritual-text-tertiary)' }}
            >
              {placeholder}
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[100px] bg-transparent border rounded-md p-3 text-sm resize-vertical focus:outline-none"
          style={{
            color: 'var(--ritual-text-primary)',
            borderColor: isOverLimit ? 'rgba(255,100,100,0.4)' : 'var(--ritual-glass-border)',
          }}
          onFocus={(e) => {
            if (!isOverLimit) {
              e.currentTarget.style.borderColor = 'rgba(57,255,20,0.3)'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(57,255,20,0.06)'
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isOverLimit ? 'rgba(255,100,100,0.4)' : 'var(--ritual-glass-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Post button */}
      <div className="flex items-center justify-end mt-4">
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="btn-glass-primary text-sm py-2 px-5"
          >
            Connect Wallet to Post
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-glass-primary text-sm py-2 px-5 flex items-center gap-2"
          >
            {isPosting ? (
              <><Loader2 size={14} className="animate-spin-slow" /> Sending...</>
            ) : showSuccess ? (
              <><Check size={14} /> Sent!</>
            ) : (
              'Post Message'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
