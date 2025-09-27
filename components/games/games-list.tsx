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
import { Season } from "@/lib/utils/season-filters";
import type { Game } from "@/lib/domain/models";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UpcomingSeason } from "./upcoming-season";
import { useSticky } from "@/hooks/use-sticky";
import { SeasonContent } from "./season-content";
import * as Tabs from "@radix-ui/react-tabs";

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

interface GamesListProps {
  filterData: {
    sessions: Array<{ id: string; name: string }>;
    divisions: Array<{ id: string; name: string }>;
    seasons: Array<{
      id: string;
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

  // Select the first active season as default
  const defaultSeason =
    filterData.seasons.find((s) => s.isActive)?.id ||
    (filterData.seasons.length > 0 ? filterData.seasons[0].id : "all");

  // Get filter values from URL or use defaults
  const season =
    searchParams.get("season") ||
    (defaultSeason !== "all" ? defaultSeason : "all");
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
      router.replace(`${pathname}?${queryString}`);
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

  const allGames = gamesData?.games || [];

  // Convert filter data seasons to Season format for SeasonTabs
  const availableSeasons: Season[] = (filterData.seasons || []).map(
    (season) => ({
      id: season.id,
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
    <div className="h-full flex flex-col">
      {/* Season Tabs - each tab gets its own content */}
      <Tabs.Root
        value={
          season === "all"
            ? availableSeasons.find((s) => s.isActive)?.id || ""
            : season
        }
        onValueChange={(value) => handleFilterChange("season", value || "all")}
        className="w-full h-full flex-1 p-2"
      >
        <Tabs.List className="flex h-10 items-center justify-start rounded-full bg-gray-200 p-1 overflow-x-auto">
          {availableSeasons.map((seasonTab) => (
            <Tabs.Trigger
              key={`trigger-${seasonTab.id}`}
              value={seasonTab.id}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-black data-[state=active]:font-bold text-gray-500",
                availableSeasons.length > 1 ? "flex-1" : "min-w-[100px]"
              )}
            >
              {seasonTab.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Each season gets its own content with its own query */}
        {availableSeasons.map((seasonTab) => {
          const filteredGames = allGames.filter((game) => {
            // Filter games to only show ones that belong to this season tab
            const gameSeasonId = game.season?.id;
            const matches = gameSeasonId === seasonTab.id;

            return matches;
          });

          return (
            <Tabs.Content
              key={`content-${seasonTab.id}`}
              value={seasonTab.id}
              className="flex-1 outline-none"
            >
              <SeasonContent
                seasonId={seasonTab.id}
                games={filteredGames}
                isLoading={isLoading}
                error={isError ? error : null}
              />
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </div>
  );
}
