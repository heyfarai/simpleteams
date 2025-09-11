"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { GameCard } from "./game-card";
import { GameFilters } from "./game-filters";
import { FilterSkeleton } from "./filter-skeleton";
import { useGames } from "@/hooks/use-games";
import { Hydrate } from "@/components/hydrate";
import { fetchGames } from "@/lib/data/fetch-games";
import { useToast } from "@/hooks/use-toast";
import { SeasonTabs } from "@/components/filters/season-tabs";
import { Season } from "@/lib/utils/season-filters";
import type { Game } from "@/types/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UpcomingSeason } from "./upcoming-season";

interface GamesListProps {
  filterData: {
    sessions: Array<{ _id: string; name: string }>;
    divisions: Array<{ _id: string; name: string }>;
    seasons: Array<{
      _id: string;
      name: string;
      year: number;
      status: string;
      isActive: boolean;
    }>;
  };
  games?: Game[];
  emptyMessage?: string;
}

export function GamesList({ filterData }: GamesListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Find 2025 Summer Series season
  const defaultSeason =
    filterData.seasons.find((s) => s.name === "2025 Summer Series")?._id ||
    "all";

  // Get filter values from URL or use defaults
  const season = searchParams.get("season") || defaultSeason;
  const session = searchParams.get("session") || "all";
  const division = searchParams.get("division") || "all";
  const status = searchParams.get("status") || "all";

  // Set default season on initial load if no filters are active
  useEffect(() => {
    if (
      !searchParams.has("season") &&
      !searchParams.has("session") &&
      !searchParams.has("division") &&
      !searchParams.has("status") &&
      defaultSeason !== "all"
    ) {
      const queryString = createQueryString({ season: defaultSeason });
      router.push(`${pathname}?${queryString}`);
    }
  }, [defaultSeason, pathname, router, createQueryString, searchParams]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  const { toast } = useToast();

  const {
    data: gamesData,
    isLoading,
    isError,
    error,
  } = useGames({
    season: season === "all" ? undefined : season,
    session: session === "all" ? undefined : session,
    division: division === "all" ? undefined : division,
    status: status === "all" ? undefined : status,
  });

  const activeFiltersCount = [
    season !== "all",
    session !== "all",
    division !== "all",
    status !== "all",
  ].filter(Boolean).length;

  const allGames = gamesData?.games || [];

  // Convert filter data seasons to Season format for SeasonTabs
  const availableSeasons: Season[] = (filterData.seasons || []).map(
    (season) => ({
      id: season._id,
      name: season.name,
      year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
      startDate: new Date(season.year, 8, 1),
      endDate: new Date(season.year + 1, 7, 31),
      status: season.status,
      isActive: Boolean(season.isActive), // Using explicit isActive field from schema
    })
  );

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast({
        variant: "destructive",
        title: "Error loading games",
        description: error.message,
        action: (
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Retry
          </button>
        ),
      });
    }
  }, [isError, error, toast]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Unable to load games</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
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

  return (
    <div className="space-y-6">
      {/* Season Tabs */}
      <div className="flex items-center justify-between gap-4">
        <SeasonTabs
          selectedSeason={season === "all" ? "" : season}
          seasons={availableSeasons}
          onSeasonChange={(value) =>
            handleFilterChange("season", value || "all")
          }
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {season === "01ecf97e-2b9a-49eb-a80a-3fe2be6a36ad" ? (
            <UpcomingSeason />
          ) : (
            <Hydrate<
              ["games", string, string, string, string],
              { games: Game[]; total: number }
            >
              queryKey={["games", season, session, division, status]}
              queryFn={() =>
                fetchGames({
                  season: season === "all" ? undefined : season,
                  session: session === "all" ? undefined : session,
                  division: division === "all" ? undefined : division,
                  status: status === "all" ? undefined : status,
                })
              }
            >
              {isLoading ? (
                <div className="grid gap-4">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <GameCard
                        key={`skeleton-${i}`}
                        game={allGames[0] ?? ({} as Game)}
                        loading={true}
                      />
                    ))}
                </div>
              ) : allGames.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No games found
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(
                    // Group games by date
                    allGames.reduce((acc, game) => {
                      const date = new Date(game.gameDate);
                      const dateKey = date.toISOString().split("T")[0];
                      if (!acc[dateKey]) acc[dateKey] = [];
                      acc[dateKey].push(game);
                      return acc;
                    }, {} as Record<string, Game[]>)
                  )
                    // Sort dates newest first
                    .sort(
                      ([dateA], [dateB]) =>
                        new Date(dateB).getTime() - new Date(dateA).getTime()
                    )
                    .map(([date, gamesForDate]) => {
                      const gameDate = new Date(date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);

                      let relativeDate = "";
                      if (gameDate.getTime() === today.getTime()) {
                        relativeDate = "Today";
                      } else if (gameDate.getTime() === tomorrow.getTime()) {
                        relativeDate = "Tomorrow";
                      } else if (gameDate.getTime() === yesterday.getTime()) {
                        relativeDate = "Yesterday";
                      }

                      const formattedDate = new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(gameDate);

                      return (
                        <div
                          key={date}
                          className="space-y-4"
                        >
                          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 border-b">
                            <h2 className="text-lg font-semibold tracking-tight">
                              {relativeDate
                                ? `${relativeDate} - ${formattedDate}`
                                : formattedDate}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {gamesForDate.length} game
                              {gamesForDate.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="grid gap-4">
                            {gamesForDate
                              .sort((a, b) => {
                                // Sort by game time within the same date
                                const timeA = a.gameTime || "";
                                const timeB = b.gameTime || "";
                                return timeA.localeCompare(timeB);
                              })
                              .map((game: Game) => (
                                <GameCard
                                  key={game._id}
                                  game={game}
                                  loading={false}
                                />
                              ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Hydrate>
          )}
        </div>
      </div>
    </div>
  );
}
