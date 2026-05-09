import { useState, useEffect, useCallback } from 'react'

interface MockStats {
  totalMessages: number
  activeWallets: number
  tps: number
  blockHeight: number
}

export function useMockStats(): MockStats {
  const [stats, setStats] = useState<MockStats>({
    totalMessages: 1247,
    activeWallets: 892,
    tps: 24,
    blockHeight: 1284921,
  })

  const jitter = useCallback((base: number, variance: number) => {
    return Math.round(base + (Math.random() - 0.5) * variance * 2)
  }, [])

  useEffect(() => {
    const tpsInterval = setInterval(() => {
      setStats((prev) => ({ ...prev, tps: jitter(24, 5) }))
    }, 3000)

    const blockInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3) + 1,
      }))
    }, 10000)

    return () => {
      clearInterval(tpsInterval)
      clearInterval(blockInterval)
    }
  }, [jitter])

  return stats
}
