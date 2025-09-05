"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Users, Calendar, Play, Award, Handshake, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TeamSelectorModal } from "./team-selector-modal"
import { useFavoriteTeam } from "@/hooks/use-favorite-team"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam()

  const navItems = [
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/players", label: "Players", icon: Award },
    { href: "/games", label: "Games", icon: Calendar },
    { href: "/watch", label: "Watch", icon: Play },
  ]

  return (
    <>
      <nav className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">National Capital Hoops Circuit</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTeamModalOpen(true)}
                className="hidden items-center gap-2"
              >
                {favoriteTeam ? (
                  <>
                    <Image
                      src={favoriteTeam.logo || "/placeholder.svg"}
                      alt={favoriteTeam.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="hidden lg:inline">{favoriteTeam.name}</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    <span className="hidden lg:inline">Pick Team</span>
                  </>
                )}
              </Button>
                <Button className="bg-primary hover:bg-primary/90 w-fit">Join League</Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsTeamModalOpen(true)
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-fit"
                >
                  {favoriteTeam ? (
                    <>
                      <Image
                        src={favoriteTeam.logo || "/placeholder.svg"}
                        alt={favoriteTeam.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      {favoriteTeam.name}
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Pick Team
                    </>
                  )}
                </Button>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="bg-primary hover:bg-primary/90 w-fit">Join League</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <TeamSelectorModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSelectTeam={setFavoriteTeam}
        selectedTeam={favoriteTeam}
      />
    </>
  )
}
