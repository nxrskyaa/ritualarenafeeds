import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'

interface WalletCardProps {
  className?: string
}

export default function WalletCard({ className = '' }: WalletCardProps) {
  const { address, isConnected, connect, disconnect } = useWalletAddress()

  if (!isConnected || !address) {
    return (
      <div className={`glass p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[var(--ritual-text-tertiary)]" />
          <p className="caption-text">Not connected</p>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--ritual-text-secondary)' }}>
          Connect your wallet to post messages onchain
        </p>
        <button onClick={connect} className="btn-glass-primary w-full text-sm">
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className={`glass p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: getAddressGradient(address),
            color: '#fff',
          }}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="mono-label text-xs truncate">{truncateAddress(address)}</p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
      </div>
      <p className="caption-text flex items-center gap-1.5 mb-3">
        <span className="w-1 h-1 rounded-full bg-[var(--ritual-success)]" />
        Ritual Testnet
      </p>
      <button
        onClick={disconnect}
        className="btn-glass-ghost w-full text-xs py-1.5"
        style={{ color: 'var(--ritual-text-tertiary)' }}
      >
        Disconnect
      </button>
    </div>
  )
}

// Standalone connect button for inline use
export function ConnectButton({ className = '' }: { className?: string }) {
  const { isConnected, connect, address } = useWalletAddress()

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 glass rounded-full px-3 py-1.5 ${className}`}>
        <div
          className="w-5 h-5 rounded-full"
          style={{ background: getAddressGradient(address) }}
        />
        <span className="mono-label text-[0.65rem]">{truncateAddress(address)}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
      </div>
    )
  }

  return (
    <button onClick={connect} className={`btn-glass-primary text-xs py-1.5 px-3 ${className}`}>
      Connect
    </button>
  )
}
