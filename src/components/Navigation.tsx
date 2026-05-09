import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Loader2, Settings } from 'lucide-react'
import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'
import SettingsModal from './SettingsModal'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const location = useLocation()
  const { address, isConnected, connect, disconnect, isConnecting } = useWalletAddress()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Feed', href: '/feed' },
    { label: 'Features', href: '/#features' },
    { label: 'Docs', href: 'https://docs.ritualfoundation.org', external: true },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'glass-nav' : 'bg-transparent'
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain animate-pulse-glow rounded"
            style={{ filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.4))' }}
          />
          <span
            className="text-sm font-semibold tracking-[0.04em]"
            style={{ color: 'var(--ritual-text-primary)' }}
          >
            Ritual Agent Feeds
          </span>
        </Link>

        {/* Center nav links - desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-sm font-normal transition-colors duration-250 hover:text-[var(--ritual-neon)]"
                style={{ color: 'var(--ritual-text-secondary)' }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="relative text-sm font-normal transition-colors duration-250 hover:text-[var(--ritual-neon)]"
                style={{ color: 'var(--ritual-text-secondary)' }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right side - Wallet Button */}
        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="hidden md:flex items-center gap-2">
              <div
                className="glass rounded-full px-3 py-1.5 flex items-center gap-2"
                style={{ border: '1px solid rgba(57,255,20,0.15)' }}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ background: getAddressGradient(address) }}
                />
                <span className="mono-label text-[0.65rem]">{truncateAddress(address)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
              </div>
              <button
                onClick={disconnect}
                className="btn-glass-ghost text-xs py-2 px-3"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="hidden md:flex btn-glass-primary text-sm py-2 px-4 items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={14} className="animate-spin-slow" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} style={{ color: 'var(--ritual-text-primary)' }} />
            ) : (
              <Menu size={20} style={{ color: 'var(--ritual-text-primary)' }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
                style={{ filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' }}
              />
              <span className="text-lg font-semibold" style={{ color: 'var(--ritual-text-primary)' }}>
                Ritual Agent Feeds
              </span>
            </div>

            {/* Mobile wallet button */}
            {isConnected && address ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 mb-4"
              >
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <div className="w-5 h-5 rounded-full" style={{ background: getAddressGradient(address) }} />
                  <span className="mono-label text-sm">{truncateAddress(address)}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
                </div>
                <button onClick={disconnect} className="btn-glass-ghost text-sm">
                  Disconnect
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={connect}
                disabled={isConnecting}
                className="btn-glass-primary mb-4 flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={14} className="animate-spin-slow" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </motion.button>
            )}

            {navLinks.map((link, i) =>
              link.external ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="text-2xl font-light"
                  style={{ color: 'var(--ritual-text-primary)' }}
                >
                  {link.label}
                </motion.a>
              ) : (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link to={link.href} className="text-2xl font-light" style={{ color: 'var(--ritual-text-primary)' }}>
                    {link.label}
                  </Link>
                </motion.div>
              )
            )}

            {/* Settings link */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.3 }}
              onClick={() => {
                setMobileOpen(false)
                setSettingsOpen(true)
              }}
              className="text-2xl font-light flex items-center gap-3"
              style={{ color: 'var(--ritual-text-secondary)' }}
            >
              <Settings size={20} />
              Settings
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
