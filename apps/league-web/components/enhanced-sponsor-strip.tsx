"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export function EnhancedSponsorStrip() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Mock sponsor data with tiers
  const sponsors = [
    {
      name: "Springfield Sports Store",
      logo: "/springfield-sports-store-logo.jpg",
      url: "https://springfieldsports.com",
      tier: "platinum",
    },
    {
      name: "Metro Bank",
      logo: "/metro-bank-logo.jpg",
      url: "https://metrobank.com",
      tier: "gold",
    },
    {
      name: "Pizza Palace",
      logo: "/pizza-palace-restaurant-logo.jpg",
      url: "https://pizzapalace.com",
      tier: "silver",
    },
    {
      name: "Fitness First Gym",
      logo: "/fitness-first-gym-logo.jpg",
      url: "https://fitnessfirst.com",
      tier: "standard",
    },
  ]

  // Auto-rotate sponsors
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [sponsors.length, isAutoPlaying])

  const nextSponsor = () => {
    setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    setIsAutoPlaying(false)
  }

  const prevSponsor = () => {
    setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="bg-muted/30 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Our Partners</h3>
          <p className="text-muted-foreground">Proudly supported by these amazing local businesses</p>
        </div>

        {/* Desktop: Show all sponsors */}
        <div className="hidden lg:flex items-center justify-center gap-12 mb-8">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300 hover:scale-110"
            >
              <div className="relative">
                <img
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={`${sponsor.name} logo`}
                  className="h-16 w-auto opacity-70 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                />
                {sponsor.tier === "platinum" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full" />
                )}
                {sponsor.tier === "gold" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden mb-8">
          <div className="relative flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSponsor}
              className="absolute left-0 z-10 bg-background/80 hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex justify-center px-12">
              <a
                href={sponsors[currentIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src={sponsors[currentIndex].logo || "/placeholder.svg"}
                  alt={`${sponsors[currentIndex].name} logo`}
                  className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSponsor}
              className="absolute right-0 z-10 bg-background/80 hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {sponsors.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/partners">
            <Button variant="outline" className="bg-transparent">
              View All Partners
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
