import PlayersShowcase from "@/components/players-showcase";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
  title: "Player Showcase",
  description: "Discover the talented athletes competing in the National Capital Hoops Circuit. View player profiles, stats, highlights, and achievements from Ottawa's premier basketball league."
});

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-48 text-center">
          <h1 className="pageTitle mt-16 lg:mt-24 font-black lg:text-8xl md:text-6xl text-5xl tracking-tight text-foreground mb-2 text-center">
            Player Showcase
          </h1>
        </div>
        <PlayersShowcase />
      </div>
    </main>
  );
}
