import { notFound } from "next/navigation";
import { fetchGameById } from "@/lib/data/fetch-games";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Game Details | NCHC League',
  description: 'View detailed information about this game including scores, teams, and venue.',
};

interface GamePageProps {
  params: {
    id: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await fetchGameById(params.id);

  if (!game) {
    notFound();
  }

  // Update metadata based on game details
  metadata.title = `${game.homeTeam.name} vs ${game.awayTeam.name} | NCHC League`;
  metadata.description = `View details for the game between ${game.homeTeam.name} and ${game.awayTeam.name} on ${new Date(game.gameDate).toLocaleDateString()}.`;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/games">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Badge
              variant={game.status === "in-progress" ? "default" :
                      game.status === "final" ? "secondary" :
                      game.status === "cancelled" ? "destructive" : "outline"}
            >
              {game.status === "in-progress" ? "Live" :
               game.status === "final" ? "Final" :
               game.status === "cancelled" ? "Cancelled" : "Scheduled"}
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {game.homeTeam.name} vs {game.awayTeam.name}
          </h1>
        </div>

        {/* Game Details */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Score and Teams */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Score</h2>
              <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                <div className="text-center">
                  <div className="font-medium">{game.homeTeam.name}</div>
                  <div className="text-3xl font-bold text-primary">
                    {game.score?.homeScore ?? "-"}
                  </div>
                </div>
                <div className="text-xl font-medium text-muted-foreground">VS</div>
                <div className="text-center">
                  <div className="font-medium">{game.awayTeam.name}</div>
                  <div className="text-3xl font-bold text-primary">
                    {game.score?.awayScore ?? "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Game Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Date & Time</dt>
                  <dd className="font-medium">
                    {game.gameDate !== "TBD" ? (
                      <>
                        {new Date(game.gameDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {game.gameTime !== "TBD" && (
                          <>
                            {" at "}
                            {game.gameTime}
                          </>
                        )}
                      </>
                    ) : "TBD"}
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
