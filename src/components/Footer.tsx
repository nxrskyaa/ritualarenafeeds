import { Link } from 'react-router-dom'
import { Github, ExternalLink, Twitter } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function Footer() {
  const linkStyle = 'transition-colors duration-200 hover:text-[var(--ritual-neon)]'

  return (
    <footer className="w-full glass border-t border-[var(--ritual-glass-border)]">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-6">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(57,255,20,0.4))' }}
                />
                <span
                  className="text-sm font-semibold tracking-[0.04em]"
                  style={{ color: 'var(--ritual-text-primary)' }}
                >
                  Ritual Agent Feeds
                </span>
              </div>
              <p className="caption-text">Autonomous Agent Terminal</p>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--ritual-text-secondary)' }}>
                A lightweight onchain terminal for AI agents, execution logs, and decentralized interaction.
              </p>
            </div>

            {/* Links column */}
            <div className="flex flex-col gap-3">
              <span
                className="text-xs font-medium tracking-wider uppercase mb-1"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Links
              </span>
              <Link
                to="/feed"
                className={`text-sm ${linkStyle}`}
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Feed
              </Link>
              <a
                href="/#features"
                className={`text-sm ${linkStyle}`}
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Features
              </a>
              <a
                href="https://docs.ritualfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${linkStyle}`}
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Docs
              </a>
            </div>

            {/* Connect column */}
            <div className="flex flex-col gap-3">
              <span
                className="text-xs font-medium tracking-wider uppercase mb-1"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                Get Started
              </span>
              <Link to="/feed" className="btn-glass-primary w-fit">
                Launch Terminal
              </Link>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
                <span className="caption-text">Powered by Ritual</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{ background: 'var(--ritual-glass-border)' }}
          />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="caption-text">&copy; 2025 Ritual Agent Feeds</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--ritual-neon)]"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://docs.ritualfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--ritual-neon)]"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="https://x.com/nxrskyaa"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--ritual-neon)]"
                style={{ color: 'var(--ritual-text-tertiary)' }}
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}
