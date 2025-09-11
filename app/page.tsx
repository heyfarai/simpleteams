import { HeroSection } from "@/components/hero-section";
import { NextSessionCard } from "@/components/next-session-card";
import { SeasonsSummary } from "@/components/seasons-summary";
import { PlayerSpotlight } from "@/components/player-spotlight";
import { HomepageWatchSection } from "@/components/homepage-watch-section";
import { EnhancedSponsorStrip } from "@/components/enhanced-sponsor-strip";
import { NewsFeed } from "@/components/news-feed";
import { LeagueDivisions } from "@/components/home/league-divisions";
import { LeagueStructure } from "@/components/home/league-structure";
import { LeagueFeatures } from "@/components/home/league-features";
import { LeagueTeamSpotlight } from "@/components/home/league-team-spotlight";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <NextSessionCard />
        <PlayerSpotlight />
        <LeagueTeamSpotlight />
        {/* <SeasonsSummary /> */}
        <LeagueStructure />
        <LeagueDivisions />
        <LeagueFeatures />
      </div>
      <EnhancedSponsorStrip />
    </main>
  );
}
