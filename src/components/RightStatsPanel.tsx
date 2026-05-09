import { MessageCircle, Users, Zap, Layers } from 'lucide-react'
import { useMockStats } from '@/hooks/useMockStats'
import { useContractStats } from '@/hooks/useContractStats'

export default function RightStatsPanel() {
  const { tps, blockHeight } = useMockStats()
  const { totalMessages, activeWallets, isLoading } = useContractStats()

  const statCards = [
    {
      icon: MessageCircle,
      value: totalMessages,
      label: 'Messages posted',
      color: 'var(--ritual-neon)',
      isLoading,
    },
    {
      icon: Users,
      value: activeWallets,
      label: 'Unique addresses',
      color: 'var(--ritual-ice-blue)',
      isLoading,
    },
    {
      icon: Zap,
      value: tps,
      label: 'Network TPS',
      color: 'var(--ritual-violet)',
      isLoading: false,
    },
    {
      icon: Layers,
      value: blockHeight,
      label: 'Latest block',
      color: 'var(--ritual-silver)',
      isLoading: false,
    },
  ]

  return (
    <aside className="hidden xl:flex flex-col w-[320px] h-screen sticky top-0 glass border-l border-[var(--ritual-glass-border)] p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h3
          className="text-base font-medium"
          style={{ color: 'var(--ritual-text-primary)' }}
        >
          Activity Overview
        </h3>
        <p className="caption-text mt-0.5">Real-time network statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-col gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="glass p-4"
            style={{ borderLeft: '2px solid var(--ritual-neon)' }}
          >
            <stat.icon size={18} style={{ color: stat.color }} className="mb-2" />
            <div
              className="text-2xl font-light"
              style={{ color: 'var(--ritual-neon)' }}
            >
              {stat.isLoading ? '...' : stat.value.toLocaleString()}
            </div>
            <p className="caption-text mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Network Status */}
      <div
        className="glass p-4"
        style={{ borderLeft: '3px solid var(--ritual-success)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
          <span
            className="text-sm"
            style={{ color: 'var(--ritual-text-primary)' }}
          >
            Network Online
          </span>
        </div>
        <p className="caption-text">Ritual Testnet — Chain ID: 1979</p>
      </div>
    </aside>
  )
}
