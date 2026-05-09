import { useState, useCallback } from 'react'

export interface Profile {
  name: string
  color?: string
  bio?: string
}

const STORAGE_KEY = 'ritual_profiles'

function loadProfiles(): Record<string, Profile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProfiles(profiles: Record<string, Profile>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Record<string, Profile>>(loadProfiles)

  const getProfile = useCallback((address: string): Profile | null => {
    return profiles[address.toLowerCase()] || null
  }, [profiles])

  const setProfile = useCallback((address: string, profile: Profile) => {
    setProfiles((prev) => {
      const next = { ...prev, [address.toLowerCase()]: profile }
      saveProfiles(next)
      return next
    })
  }, [])

  const getDisplayName = useCallback((address: string): string => {
    const p = profiles[address.toLowerCase()]
    return p?.name || address.slice(0, 6) + '...' + address.slice(-4)
  }, [profiles])

  return { profiles, getProfile, setProfile, getDisplayName }
}
