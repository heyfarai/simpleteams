import { notFound } from "next/navigation";
import { fetchGameById } from "@/lib/data/fetch-games";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TeamLogo } from "@/components/team-logo";

export const metadata = {
  title: "Game Details | NCHC League",
  description:
    "View detailed information about this game including scores, teams, and venue.",
};

interface GamePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = await fetchGameById(id);

  if (!game) {
    notFound();
  }

  // Update metadata based on game details
  metadata.title = `${game.homeTeam.name} vs ${game.awayTeam.name} | NCHC League`;
  metadata.description = `View details for the game between ${
    game.homeTeam.name
  } and ${game.awayTeam.name} on ${new Date(
    game.date
  ).toLocaleDateString()}.`;

  return (
    <div className="container mx-auto px-4 py-8 mt-28">
      <div className="mb-6 max-w-4xl mx-auto">
        <Link href="/games">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-6 items-center">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                game.status === "live"
                  ? "default"
                  : game.status === "completed"
                  ? "secondary"
                  : game.status === "cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {game.status === "live"
                ? "Live"
                : game.status === "completed"
                ? "Final"
                : game.status === "cancelled"
                ? "Cancelled"
                : "Scheduled"}
            </Badge>
            {game.session?.name && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {game.session.name}
              </Badge>
            )}
          </div>
          <h1 className="font-black lg:text-8xl md:text-6xl text-5xl tracking-tight flex items-center gap-2">
            {game.homeTeam.name} vs {game.awayTeam.name}
          </h1>
        </div>

        {/* Game Details */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-col md:gap-8">
            {/* Score and Teams */}
            <div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                {/* Home Team Logo */}
                <div className="flex-shrink-0">
                  <Link
                    href={`/teams/${game.homeTeam.id}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <TeamLogo
                      teamName={game.homeTeam.name}
                      logoUrl={game.homeTeam.logo}
                      size="lg"
                      className="w-16 h-16"
                    />
                  </Link>
                </div>

                <div className="text-center">
                  <div className="font-medium">{game.homeTeam.name}</div>
                  <div className="text-3xl font-black text-primary">
                    {game.score?.homeScore ?? "-"}
                  </div>
                </div>

                <div className="text-xl font-medium text-muted-foreground">
                  VS
                </div>

                <div className="text-center">
                  <div className="font-medium">{game.awayTeam.name}</div>
                  <div className="text-3xl font-bold text-primary">
                    {game.score?.awayScore ?? "-"}
                  </div>
                </div>

                {/* Away Team Logo */}
                <div className="flex-shrink-0">
                  <Link
                    href={`/teams/${game.awayTeam.id}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <TeamLogo
                      teamName={game.awayTeam.name}
                      logoUrl={game.awayTeam.logo}
                      size="lg"
                      className="w-16 h-16"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Date & Time</dt>
                  <dd className="font-medium">
                    {game.date !== "TBD" ? (
                      <>
                        {new Date(game.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {game.time !== "TBD" && (
                          <>
                            {" at "}
                            {game.time}
                          </>
                        )}
                      </>
                    ) : (
                      "TBD"
                    )}
                  </dd>
                </div>
                {game.session?.name && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Session</dt>
                    <dd className="font-medium">{game.session.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{game.status}</dd>
                </div>
                {game.venue !== "TBD" && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Venue</dt>
                    <dd className="font-medium">{game.venue}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
