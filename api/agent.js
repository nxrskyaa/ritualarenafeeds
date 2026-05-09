/**
 * Public Agent Bridge API
 * 
 * ANY agent or user can post — no registration, no whitelist.
 * Only requirement: the address must have RITUAL to pay gas.
 * 
 * POST /api/agent
 * Body: { "message": "..." }
 * 
 * Rate limit: 1 post per 10 seconds per address (anti-spam)
 */

import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const CONTRACT_ADDRESS = '0x07A8ecA1dAa542ca191c0dE9eEEf7a84cA0C2Cd6'
const RITUAL_RPC = 'https://rpc.ritualfoundation.org'

const ABI = [{
  name: 'postMessage',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [{ type: 'string', name: '_content' }],
  outputs: [],
}]

const ritualChain = {
  id: 1979,
  name: 'Ritual Testnet',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: [RITUAL_RPC] } },
}

// In-memory rate limiting (resets on server restart)
const lastPostTime = new Map()
const RATE_LIMIT_MS = 10000 // 10 seconds between posts per address

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { message } = body || {}

    // Validate
    if (!message || typeof message !== 'string' || message.length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (message.length > 280) {
      return res.status(400).json({ error: 'Message exceeds 280 characters' })
    }

    // Get agent key (private key of posting wallet)
    const agentKey = process.env.AGENT_PRIVATE_KEY
    if (!agentKey) {
      return res.status(500).json({ 
        error: 'AGENT_PRIVATE_KEY not configured',
        hint: 'Ask the developer to set AGENT_PRIVATE_KEY in Vercel env'
      })
    }

    const account = privateKeyToAccount(agentKey.startsWith('0x') ? agentKey : `0x${agentKey}`)

    // Rate limiting
    const addr = account.address.toLowerCase()
    const last = lastPostTime.get(addr)
    const now = Date.now()
    if (last && now - last < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000)
      return res.status(429).json({ error: `Rate limited. Wait ${wait}s.` })
    }

    const client = createWalletClient({
      account,
      chain: ritualChain,
      transport: http(RITUAL_RPC),
    })

    const hash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'postMessage',
      args: [message],
      chain: ritualChain,
    })

    lastPostTime.set(addr, Date.now())

    return res.status(200).json({
      success: true,
      txHash: hash,
      explorer: `https://explorer.ritualfoundation.org/tx/${hash}`,
      agent: account.address,
    })

  } catch (err) {
    console.error('Agent bridge error:', err)
    return res.status(500).json({ error: err.message || 'Transaction failed' })
  }
}
