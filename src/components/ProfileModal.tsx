import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit2, Check, ExternalLink, MessageCircle, Heart } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress, timeAgo } from '@/lib/utils'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import type { FeedEntry } from '@/types'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  address: string | null
  entries: FeedEntry[]
}

export default function ProfileModal({ isOpen, onClose, address, entries }: ProfileModalProps) {
  const { getProfile, setProfile, getDisplayName } = useProfiles()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')

  const profile = address ? getProfile(address) : null
  const displayName = address ? getDisplayName(address) : ''

  const userEntries = useMemo(() => {
    if (!address) return []
    return entries
      .filter((e) => e.address.toLowerCase() === address.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [address, entries])

  const totalLikes = userEntries.reduce((sum, e) => sum + e.likes, 0)

  const handleSave = () => {
    if (!address || !editName.trim()) return
    setProfile(address, {
      name: editName.trim(),
      bio: editBio.trim() || undefined,
    })
    setIsEditing(false)
  }

  const startEdit = () => {
    setEditName(profile?.name || '')
    setEditBio(profile?.bio || '')
    setIsEditing(true)
  }

  if (!address) return null

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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="glass-strong relative w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.4), transparent)' }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-[var(--ritual-glass-hover)] z-10"
              style={{ color: 'var(--ritual-text-tertiary)' }}
            >
              <X size={18} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto p-8">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    background: getAddressGradient(address),
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(57,255,20,0.15)',
                  }}
                >
                  {(profile?.name?.[0] || address[2]).toUpperCase()}
                </div>
              </div>

              {/* Name */}
              {isEditing ? (
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your display name..."
                    className="w-full glass bg-transparent border rounded-md p-2.5 text-sm"
                    style={{
                      color: 'var(--ritual-text-primary)',
                      borderColor: 'var(--ritual-glass-border)',
                    }}
                    maxLength={20}
                  />
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short bio (optional)..."
                    className="w-full glass bg-transparent border rounded-md p-2.5 text-sm"
                    style={{
                      color: 'var(--ritual-text-primary)',
                      borderColor: 'var(--ritual-glass-border)',
                    }}
                    maxLength={60}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn-glass-primary text-xs py-1.5 px-4 flex items-center gap-1">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn-glass-ghost text-xs py-1.5 px-4">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4 relative">
                  <h2
                    className="text-xl font-medium"
                    style={{ color: 'var(--ritual-text-primary)' }}
                  >
                    {displayName}
                  </h2>
                  {profile?.bio && (
                    <p className="text-sm mt-1" style={{ color: 'var(--ritual-text-secondary)' }}>
                      {profile.bio}
                    </p>
                  )}
                  <p className="mono-label text-xs mt-1">{truncateAddress(address)}</p>
                  <button
                    onClick={startEdit}
                    className="absolute -right-1 top-0 p-1.5 rounded-full transition-colors hover:bg-[var(--ritual-glass-hover)]"
                    style={{ color: 'var(--ritual-text-tertiary)' }}
                    title="Edit profile"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle size={14} style={{ color: 'var(--ritual-neon)' }} />
                    <span className="text-lg font-light" style={{ color: 'var(--ritual-text-primary)' }}>
                      {userEntries.length}
                    </span>
                  </div>
                  <p className="caption-text">Posts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart size={14} style={{ color: 'var(--ritual-neon)' }} />
                    <span className="text-lg font-light" style={{ color: 'var(--ritual-text-primary)' }}>
                      {totalLikes}
                    </span>
                  </div>
                  <p className="caption-text">Likes</p>
                </div>
              </div>

              {/* Explorer link */}
              <a
                href={`${RITUAL_CHAIN_CONFIG.blockExplorers.default.url}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass-secondary w-full text-xs flex items-center justify-center gap-2 mb-6"
              >
                <ExternalLink size={12} />
                View on Ritual Explorer
              </a>

              {/* Divider */}
              <div className="h-px w-full mb-4" style={{ background: 'var(--ritual-glass-border)' }} />

              {/* Posts list */}
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--ritual-text-secondary)' }}>
                Posts ({userEntries.length})
              </h3>

              {userEntries.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--ritual-text-tertiary)' }}>
                  No posts yet
                </p>
              ) : (
                <div className="space-y-3">
                  {userEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="glass p-3 rounded-lg"
                      style={{ borderLeft: '2px solid var(--ritual-neon)' }}
                    >
                      <p className="text-sm" style={{ color: 'var(--ritual-text-primary)' }}>
                        {entry.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="caption-text">{timeAgo(entry.timestamp)}</span>
                        <span className="caption-text flex items-center gap-1">
                          <Heart size={10} /> {entry.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
