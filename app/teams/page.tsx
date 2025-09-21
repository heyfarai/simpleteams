import { TeamsDirectory } from "@/components/teams-directory";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
  title: "Teams Directory",
  description: "Explore all teams competing in the National Capital Hoops Circuit. View team profiles, rosters, stats, and achievements from across all divisions in Ottawa's premier basketball league."
});
export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-16 md:mt-24 text-center">
          <div className="heading-highlight-container">
            <h1 className="display-heading heading-highlight">Teams</h1>
          </div>
        </div>
        <TeamsDirectory />
      </div>
    </main>
  );
}
