"use client"

import { useEffect, useState } from "react"

export function SponsorStrip() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock sponsor data
  const sponsors = [
    {
      name: "Springfield Sports Store",
      logo: "/springfield-sports-store-logo.jpg",
      url: "https://springfieldsports.com",
    },
    {
      name: "Metro Bank",
      logo: "/metro-bank-logo.jpg",
      url: "https://metrobank.com",
    },
    {
      name: "Pizza Palace",
      logo: "/pizza-palace-restaurant-logo.jpg",
      url: "https://pizzapalace.com",
    },
    {
      name: "Fitness First Gym",
      logo: "/fitness-first-gym-logo.jpg",
      url: "https://fitnessfirst.com",
    },
  ]

  // Auto-rotate sponsors
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [sponsors.length])

  return (
    <section className="bg-muted/30 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-muted-foreground">Our Partners</h3>
        </div>

        {/* Desktop: Show all sponsors */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform hover:scale-105"
            >
              <img
                src={sponsor.logo || "/placeholder.svg"}
                alt={`${sponsor.name} logo`}
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="flex justify-center">
            <a
              href={sponsors[currentIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src={sponsors[currentIndex].logo || "/placeholder.svg"}
                alt={`${sponsors[currentIndex].name} logo`}
                className="h-12 w-auto opacity-70"
              />
            </a>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {sponsors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
