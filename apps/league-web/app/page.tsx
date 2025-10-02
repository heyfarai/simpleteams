import { HeroSection } from "@/components/home/hero-section";
import { PlayerSpotlight } from "@/components/player-spotlight";
import { HomepageWatchSection } from "@/components/home/homepage-watch-section";
import { EnhancedSponsorStrip } from "@/components/enhanced-sponsor-strip";
import { LeagueDivisions } from "@/components/home/league-divisions";
import { LeagueStructure } from "@/components/home/league-structure";
import { LeagueFeatures } from "@/components/home/league-features";
import { LeagueTeamSpotlight } from "@/components/home/league-team-spotlight";
import { NextSessionCard } from "@/components/home/next-session-card";
import { HowTheCircuitWorks } from "@/components/games/how-the-circuit-works";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
  title: "Ottawa's Premier Basketball League",
  description:
    "Join the National Capital Hoops Circuit - Ottawa's elite basketball league featuring competitive divisions, player development, and championship tournaments. Register your team today and compete at the highest level.",
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NextSessionCard />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <LeagueDivisions />
        <LeagueStructure />
        <LeagueFeatures />
        <LeagueTeamSpotlight />
        {/* <PlayerSpotlight /> */}
      </div>
      {/* <EnhancedSponsorStrip /> */}
    </main>
  );
}
