"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { sampleTeams } from "@/lib/sample-data"
import Image from "next/image"

interface TeamSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTeam: (team: any) => void
  selectedTeam?: any
}

export function TeamSelectorModal({ isOpen, onClose, onSelectTeam, selectedTeam }: TeamSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTeams = sampleTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.division.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectTeam = (team: any) => {
    onSelectTeam(team)
    onClose()
  }

  const handleRemoveFavorite = () => {
    onSelectTeam(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Favorite Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Selection */}
          {selectedTeam && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedTeam.logo || "/placeholder.svg"}
                    alt={selectedTeam.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{selectedTeam.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTeam.division}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleRemoveFavorite}>
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Teams List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className={`w-full p-3 rounded-lg border text-left hover:bg-muted transition-colors ${
                  selectedTeam?.id === team.id ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={team.logo || "/placeholder.svg"}
                    alt={team.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-muted-foreground">{team.division}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredTeams.length === 0 && <p className="text-center text-muted-foreground py-4">No teams found</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
