import { createPublicClient, createWalletClient, custom, http, publicActions } from 'viem'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import { useWalletStore } from '@/store/walletStore'

// Public client (read-only, no wallet needed)
export function getPublicClient() {
  return createPublicClient({
    chain: RITUAL_CHAIN_CONFIG,
    transport: http(RITUAL_CHAIN_CONFIG.rpcUrls.default.http[0]),
  })
}

// Wallet client (requires connected wallet)
export function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found. Please install MetaMask.')
  }
  return createWalletClient({
    chain: RITUAL_CHAIN_CONFIG,
    transport: custom(window.ethereum),
  }).extend(publicActions)
}

// Hook for wallet address — now reads from global store
export function useWalletAddress() {
  return useWalletStore()
}
