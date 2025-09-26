"use client";

import { GameCard } from "./game-card";
import { FilterSkeleton } from "./filter-skeleton";
import { UpcomingSeason } from "./upcoming-season";
import { cn } from "@/lib/utils";
import { useSticky } from "@/hooks/use-sticky";
import type { Game } from "@/lib/domain/models";

interface DateSectionProps {
  date: string;
  relativeDate: string;
  formattedDate: string;
  gamesCount: number;
  children: React.ReactNode;
}

function DateSection({
  date,
  relativeDate,
  formattedDate,
  gamesCount,
  children,
}: DateSectionProps) {
  const { ref, isSticky } = useSticky();

  return (
    <div className="space-y-4 mt-8">
      <div
        ref={ref}
        className={cn(
          "sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 transition-all duration-200",
          isSticky ? "border-b" : ""
        )}
      >
        <h2 className="text-lg font-semibold tracking-tight">
          {relativeDate ? `${relativeDate} - ${formattedDate}` : formattedDate}
        </h2>
        <p className="text-sm text-muted-foreground">
          {gamesCount} game{gamesCount !== 1 ? "s" : ""}
        </p>
      </div>
      {children}
    </div>
  );
}

interface SeasonContentProps {
  seasonId: string;
  games: Game[];
  isLoading: boolean;
  error?: Error | null;
}

export function SeasonContent({
  seasonId,
  games,
  isLoading,
  error,
}: SeasonContentProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Unable to load games</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
        >
          Try again
        </button>
      </div>
    );
  }

  const allGames = games || [];

  // Show upcoming season message if no games
  if (!isLoading && allGames.length === 0) {
    return <UpcomingSeason />;
  }

  // Group games by date
  const gamesByDate = allGames.reduce((acc, game) => {
    const dateKey = game.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(game);
    return acc;
  }, {} as Record<string, typeof allGames>);

  const sortedDates = Object.keys(gamesByDate).sort();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p>Loading games...</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {sortedDates.map((date) => {
        const games = gamesByDate[date];
        const gameDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        gameDate.setHours(0, 0, 0, 0);

        const diffTime = gameDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let relativeDate = "";
        if (diffDays === 0) {
          relativeDate = "Today";
        } else if (diffDays === 1) {
          relativeDate = "Tomorrow";
        } else if (diffDays === -1) {
          relativeDate = "Yesterday";
        } else if (diffDays > 1 && diffDays <= 7) {
          relativeDate = `In ${diffDays} days`;
        } else if (diffDays < -1 && diffDays >= -7) {
          relativeDate = `${Math.abs(diffDays)} days ago`;
        }

        const formattedDate = gameDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <DateSection
            key={date}
            date={date}
            relativeDate={relativeDate}
            formattedDate={formattedDate}
            gamesCount={games.length}
          >
            <div className="grid gap-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                />
              ))}
            </div>
          </DateSection>
        );
      })}
    </div>
  );
}
