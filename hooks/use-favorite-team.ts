"use client"

import { useState, useEffect } from "react"

export function useFavoriteTeam() {
  const [favoriteTeam, setFavoriteTeam] = useState<any>(null)

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

  const updateFavoriteTeam = (team: any) => {
    setFavoriteTeam(team)
    if (team) {
      localStorage.setItem("favoriteTeam", JSON.stringify(team))
    } else {
      localStorage.removeItem("favoriteTeam")
    }
  }

  return {
    favoriteTeam,
    setFavoriteTeam: updateFavoriteTeam,
  }
}
