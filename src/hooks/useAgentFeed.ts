import { useState, useCallback } from 'react'
import { getPublicClient, getWalletClient } from './useViemClient'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/constants'
import type { FeedEntry } from '@/types'

// Convert contract message to FeedEntry
function toFeedEntry(msg: {
  id: bigint
  author: string
  content: string
  timestamp: bigint
  likes: bigint
  exists: boolean
}): FeedEntry {
  return {
    id: msg.id.toString(),
    address: msg.author,
    message: msg.content,
    timestamp: new Date(Number(msg.timestamp) * 1000).toISOString(),
    type: 'user',
    status: 'confirmed',
    likes: Number(msg.likes),
    liked: false,
    txHash: undefined,
  }
}

export function useAgentFeed() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // Read: Get recent messages from contract
  const getMessages = useCallback(async (offset = 0, limit = 50): Promise<FeedEntry[]> => {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not configured')
      return []
    }

    setIsLoading(true)
    try {
      const client = getPublicClient()
      const messages = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getRecentMessages',
        args: [BigInt(offset), BigInt(limit)],
      })

      return messages
        .filter((msg) => msg.exists)
        .map(toFeedEntry)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Read: Get total message count
  const getMessageCount = useCallback(async (): Promise<number> => {
    if (!CONTRACT_ADDRESS) return 0

    try {
      const client = getPublicClient()
      const count = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getMessageCount',
      })
      return Number(count)
    } catch {
      return 0
    }
  }, [])

  // Read: Check if user liked a message
  const checkLiked = useCallback(
    async (userAddress: string, messageId: string): Promise<boolean> => {
      if (!CONTRACT_ADDRESS) return false

      try {
        const client = getPublicClient()
        return await client.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'userHasLiked',
          args: [userAddress as `0x${string}`, BigInt(messageId)],
        })
      } catch {
        return false
      }
    },
    []
  )

  // Write: Post a message
  const postMessage = useCallback(
    async (content: string): Promise<{ hash: string; entry: FeedEntry }> => {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env')
      }

      setIsPosting(true)
      try {
        const walletClient = getWalletClient()
        const [account] = await walletClient.getAddresses()

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'postMessage',
          args: [content],
          account,
          chain: undefined,
        })

        // Wait for receipt
        const publicClient = getPublicClient()
        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        if (receipt.status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        // Get the new message count to determine ID
        const count = await getMessageCount()

        const entry: FeedEntry = {
          id: count.toString(),
          address: account,
          message: content,
          timestamp: new Date().toISOString(),
          type: 'user',
          status: 'confirmed',
          likes: 0,
          liked: false,
          txHash: hash,
        }

        return { hash, entry }
      } catch (err: unknown) {
        const error = err as Error
        // Parse contract errors
        if (error.message?.includes('EmptyMessage')) {
          throw new Error('Message cannot be empty')
        }
        if (error.message?.includes('MessageTooLong')) {
          throw new Error('Message exceeds 280 characters')
        }
        throw error
      } finally {
        setIsPosting(false)
      }
    },
    [getMessageCount]
  )

  // Write: Like a message
  const likeMessage = useCallback(async (messageId: string): Promise<string> => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    setIsLiking(true)
    try {
      const walletClient = getWalletClient()
      const [account] = await walletClient.getAddresses()

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'likeMessage',
        args: [BigInt(messageId)],
        account,
        chain: undefined,
      })

      const publicClient = getPublicClient()
      await publicClient.waitForTransactionReceipt({ hash })

      return hash
    } catch (err: unknown) {
      const error = err as Error
      if (error.message?.includes('AlreadyLiked')) {
        throw new Error('You already liked this message')
      }
      throw error
    } finally {
      setIsLiking(false)
    }
  }, [])

  // Write: Unlike a message
  const unlikeMessage = useCallback(async (messageId: string): Promise<string> => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    setIsLiking(true)
    try {
      const walletClient = getWalletClient()
      const [account] = await walletClient.getAddresses()

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'unlikeMessage',
        args: [BigInt(messageId)],
        account,
        chain: undefined,
      })

      const publicClient = getPublicClient()
      await publicClient.waitForTransactionReceipt({ hash })

      return hash
    } finally {
      setIsLiking(false)
    }
  }, [])

  return {
    // State
    isLoading,
    isPosting,
    isLiking,
    // Actions
    getMessages,
    getMessageCount,
    checkLiked,
    postMessage,
    likeMessage,
    unlikeMessage,
  }
}
