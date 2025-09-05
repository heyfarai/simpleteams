import { HeroSection } from "@/components/hero-section"
import { NextSessionCard } from "@/components/next-session-card"
import { SeasonsSummary } from "@/components/seasons-summary"
import { PlayerSpotlight } from "@/components/player-spotlight"
import { HomepageWatchSection } from "@/components/homepage-watch-section"
import { EnhancedSponsorStrip } from "@/components/enhanced-sponsor-strip"
import { NewsFeed } from "@/components/news-feed"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <NextSessionCard />
        <SeasonsSummary />
        <PlayerSpotlight />
        <HomepageWatchSection />
        <NewsFeed />
      </div>
      <EnhancedSponsorStrip />
    </main>
  )
}
