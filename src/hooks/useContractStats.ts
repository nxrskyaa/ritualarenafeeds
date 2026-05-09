import { useState, useEffect, useCallback } from 'react'
import { getPublicClient } from './useViemClient'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/constants'

export function useContractStats() {
  const [totalMessages, setTotalMessages] = useState(0)
  const [activeWallets, setActiveWallets] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!CONTRACT_ADDRESS) return

    try {
      const client = getPublicClient()

      // Get message count from contract
      const count = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getMessageCount',
      })
      setTotalMessages(Number(count))

      // Count unique authors by reading messages
      if (Number(count) > 0) {
        const messages = await client.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'getAllMessages',
        })

        const uniqueAuthors = new Set<string>()
        messages.forEach((msg) => {
          if (msg.exists) uniqueAuthors.add(msg.author)
        })
        setActiveWallets(uniqueAuthors.size)
      }
    } catch {
      // Contract might be empty or RPC error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Poll every 15s
    const interval = setInterval(fetchStats, 15000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { totalMessages, activeWallets, isLoading, refetch: fetchStats }
}
