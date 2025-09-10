"use client"

import { useState, useEffect } from "react"

export function useFavoriteTeam(teamId: string) {
  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(null)

  useEffect(() => {
    // Load favorite team from localStorage on mount
    const stored = localStorage.getItem("favoriteTeam")
    if (stored) {
      try {
        setFavoriteTeam(JSON.parse(stored))
      } catch (error) {
        console.error("Error parsing favorite team from localStorage:", error)
      }
    }
  }, [])

  const toggleFollow = () => {
    const newValue = favoriteTeam === teamId ? null : teamId
    setFavoriteTeam(newValue)
    if (newValue) {
      localStorage.setItem("favoriteTeam", JSON.stringify(newValue))
    } else {
      localStorage.removeItem("favoriteTeam")
    }
  }

  return {
    isFollowing: favoriteTeam === teamId,
    toggleFollow,
  }
}
