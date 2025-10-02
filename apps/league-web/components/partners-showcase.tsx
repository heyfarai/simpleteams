"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star, Award, Crown, Shield } from "lucide-react"

export function PartnersShowcase() {
  // Mock sponsors data with tiers
  const sponsors = [
    {
      id: 1,
      name: "Springfield Sports Store",
      logo: "/springfield-sports-store-logo.jpg",
      website: "https://springfieldsports.com",
      description:
        "Your local sports equipment headquarters. Springfield Sports Store has been serving athletes for over 20 years with top-quality gear and expert advice.",
      tier: "platinum",
      benefits: ["Equipment discounts for all players", "Exclusive gear previews", "Team uniform partnerships"],
      yearPartner: "2020",
      contact: "partnerships@springfieldsports.com",
    },
    {
      id: 2,
      name: "Metro Bank",
      logo: "/metro-bank-logo.jpg",
      website: "https://metrobank.com",
      description:
        "Supporting community athletics and helping dreams come true. Metro Bank believes in investing in local sports and youth development.",
      tier: "gold",
      benefits: ["Financial literacy workshops", "Scholarship opportunities", "Community event sponsorship"],
      yearPartner: "2021",
      contact: "community@metrobank.com",
    },
    {
      id: 3,
      name: "Pizza Palace",
      logo: "/pizza-palace-restaurant-logo.jpg",
      website: "https://pizzapalace.com",
      description:
        "Fuel your game with great pizza! Pizza Palace provides post-game meals and team celebration catering for our basketball community.",
      tier: "silver",
      benefits: ["Team meal discounts", "Post-game celebration catering", "Player of the month rewards"],
      yearPartner: "2022",
      contact: "events@pizzapalace.com",
    },
    {
      id: 4,
      name: "Fitness First Gym",
      logo: "/fitness-first-gym-logo.jpg",
      website: "https://fitnessfirst.com",
      description:
        "Train like a champion with state-of-the-art facilities. Fitness First Gym offers specialized training programs for basketball players.",
      tier: "standard",
      benefits: ["Player training discounts", "Conditioning programs", "Injury prevention workshops"],
      yearPartner: "2023",
      contact: "training@fitnessfirst.com",
    },
  ]

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Crown className="h-5 w-5" />
      case "gold":
        return <Award className="h-5 w-5" />
      case "silver":
        return <Star className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  // Group sponsors by tier
  const sponsorsByTier = {
    platinum: sponsors.filter((s) => s.tier === "platinum"),
    gold: sponsors.filter((s) => s.tier === "gold"),
    silver: sponsors.filter((s) => s.tier === "silver"),
    standard: sponsors.filter((s) => s.tier === "standard"),
  }

  return (
    <div className="space-y-12">
      {/* Partnership Benefits */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Partnership Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Brand Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Get your brand in front of hundreds of players, families, and basketball fans
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Community Impact</h3>
              <p className="text-sm text-muted-foreground">
                Support local athletics and help develop the next generation of athletes
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Networking</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other local businesses and build lasting community relationships
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button className="bg-primary hover:bg-primary/90">
              <ExternalLink className="h-4 w-4 mr-2" />
              Become a Partner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sponsors by Tier */}
      {Object.entries(sponsorsByTier).map(([tier, tierSponsors]) => {
        if (tierSponsors.length === 0) return null

        return (
          <div key={tier} className="space-y-6">
            <div className="text-center">
              <Badge className={`${getTierColor(tier)} text-lg px-4 py-2 capitalize`}>
                {getTierIcon(tier)}
                <span className="ml-2">{tier} Partners</span>
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {tierSponsors.map((sponsor) => (
                <Card key={sponsor.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6 mb-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={sponsor.logo || "/placeholder.svg"}
                          alt={`${sponsor.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{sponsor.name}</h3>
                          <Badge className={getTierColor(sponsor.tier)} variant="secondary">
                            {getTierIcon(sponsor.tier)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Partner since {sponsor.yearPartner}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{sponsor.description}</p>

                    {/* Benefits */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Partnership Benefits</h4>
                      <ul className="space-y-1">
                        {sponsor.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => window.open(sponsor.website, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => (window.location.href = `mailto:${sponsor.contact}`)}
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in Partnering With Us?</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Join our community of partners and help support local basketball while growing your business. We offer
            flexible partnership packages to fit your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Download Partnership Info
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              Schedule a Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
