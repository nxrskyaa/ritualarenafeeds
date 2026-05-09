import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle, Loader2, Heart } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress, timeAgo } from '@/lib/utils'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import type { FeedEntry as FeedEntryType } from '@/types'

interface FeedEntryProps {
  entry: FeedEntryType
  isNew?: boolean
  onViewProfile?: (address: string) => void
}

export default function FeedEntry({
  entry,
  isNew = false,
  onViewProfile,
}: FeedEntryProps) {
  const { getDisplayName } = useProfiles()
  const displayName = getDisplayName(entry.address)

  const statusIcon =
    entry.status === 'confirmed' ? (
      <CheckCircle size={14} className="text-[var(--ritual-success)]" />
    ) : entry.status === 'pending' ? (
      <Loader2 size={14} className="text-[var(--ritual-pending)] animate-spin-slow" />
    ) : null

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass p-5 md:p-6 relative"
      style={
        isNew
          ? {
              borderLeft: '3px solid var(--ritual-neon)',
              boxShadow: '0 0 20px rgba(57,255,20,0.08)',
            }
          : undefined
      }
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <button
          onClick={() => onViewProfile?.(entry.address)}
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold transition-transform hover:scale-110"
          style={{
            background: getAddressGradient(entry.address),
            color: '#fff',
          }}
        >
          {displayName[0].toUpperCase()}
        </button>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onViewProfile?.(entry.address)}
            className="text-sm font-medium block transition-colors hover:text-[var(--ritual-neon)]"
            style={{ color: 'var(--ritual-text-primary)' }}
          >
            {displayName}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mono-label text-[0.7rem]">{truncateAddress(entry.address)}</span>
            <span className="caption-text">{timeAgo(entry.timestamp)}</span>
          </div>
        </div>

        {/* Type badge */}
        <div
          className="glass rounded-full px-2.5 py-0.5 flex items-center gap-1.5 shrink-0"
          style={{ border: '1px solid rgba(57,255,20,0.1)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: entry.type === 'agent' ? 'var(--ritual-neon)' : 'var(--ritual-silver)',
            }}
          />
          <span className="caption-text text-[0.65rem]">{entry.type === 'agent' ? 'Agent' : 'User'}</span>
        </div>

        {/* Status */}
        <div className="shrink-0">{statusIcon}</div>

        {/* Explorer */}
        <a
          href={`${RITUAL_CHAIN_CONFIG.blockExplorers.default.url}/address/${entry.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 transition-colors hover:text-[var(--ritual-neon)]"
          style={{ color: 'var(--ritual-text-tertiary)' }}
          title="View on Ritual Explorer"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Message */}
      <p
        className="text-sm leading-relaxed mt-4 break-words"
        style={{ color: 'var(--ritual-text-primary)' }}
      >
        {entry.message}
      </p>

      {/* Only like count + explorer link */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5" style={{ color: 'var(--ritual-text-tertiary)' }}>
          <Heart size={14} />
          <span className="caption-text text-[0.7rem]">{entry.likes}</span>
        </div>
      </div>
    </motion.div>
  )
}
