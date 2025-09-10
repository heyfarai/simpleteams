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
import type { Game } from "@/types/schema";

interface GamesListProps {
  filterData: {
    sessions: Array<{ _id: string; name: string }>;
    divisions: Array<{ _id: string; name: string }>;
    seasons: Array<{ _id: string; name: string }>;
  };
}

export function GamesList({ filterData }: GamesListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const season = searchParams.get("season") || "all";
  const session = searchParams.get("session") || "all";
  const division = searchParams.get("division") || "all";
  const status = searchParams.get("status") || "all";

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

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  const { toast } = useToast();

  const {
    data,
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

  const allGames = data?.games ?? [];

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
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
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
    <div className="flex flex-col lg:flex-row gap-6">
      {isLoading ? (
        <FilterSkeleton />
      ) : (
        <GameFilters
          filterData={filterData}
          selectedSeason={season}
          selectedSession={session}
          selectedDivision={division}
          onSeasonChange={(value) => handleFilterChange("season", value)}
          onSessionChange={(value) => handleFilterChange("session", value)}
          onDivisionChange={(value) => handleFilterChange("division", value)}
          onClearAll={() => {
            router.push(pathname);
          }}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      <div className="flex-1">
        <Hydrate<["games", string, string, string, string], { games: Game[], total: number }>
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
          <div className="grid gap-4">
            {allGames.map((game: Game) => (
              <GameCard
                key={game._id}
                game={game}
                loading={false}
              />
            ))}
            {isLoading && [
              ...Array(3).fill(null).map((_, i) => (
                <GameCard
                  key={`skeleton-${i}`}
                  game={allGames[0] ?? {} as Game}
                  loading={true}
                />
              ))
            ]}
          </div>

          {!isLoading && allGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No games found</p>
            </div>
          )}
        </Hydrate>
      </div>
    </div>
  );
}
