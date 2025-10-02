"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Season } from "@/lib/utils/season-filters";

interface SeasonTabsProps {
  seasons: Season[];
  selectedSeason: string;
  onSeasonChange: (seasonId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function SeasonTabs({
  seasons,
  selectedSeason,
  onSeasonChange,
  className,
  children,
}: SeasonTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSeasonChange = (value: string) => {
    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());
    params.set('season', value);
    router.push(`?${params.toString()}`, { scroll: false });

    // Call the parent callback
    onSeasonChange(value);
  };

  return (
    <Tabs.Root
      value={selectedSeason}
      onValueChange={handleSeasonChange}
      className={cn("w-full h-full ", className)}
    >
      <Tabs.List className="flex h-10 items-center justify-start rounded-full bg-gray-200 p-1 overflow-x-auto">
        {seasons
          .map((season, index, allSeasons) => (
            <Tabs.Trigger
              key={`trigger-${season.id}`}
              value={season.id}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm  ring-offset-background transition-all  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-black data-[state=active]:font-bold text-gray-500 ",
                allSeasons.length > 1 ? "flex-1" : "min-w-[100px]"
              )}
            >
              {season.name}
            </Tabs.Trigger>
          ))}
      </Tabs.List>

      {/* Content area that expands to fill remaining space */}
      {seasons
        .map((season) => (
          <Tabs.Content
            key={`content-${season.id}`}
            value={season.id}
            className="flex-1 outline-none mt-4"
          >
            <div key={`content-wrapper-${season.id}`}>
              {children}
            </div>
          </Tabs.Content>
        ))}
    </Tabs.Root>
  );
}
