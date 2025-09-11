"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { Season } from "@/lib/utils/season-filters";

interface SeasonTabsProps {
  seasons: Season[];
  selectedSeason: string;
  onSeasonChange: (seasonId: string) => void;
  className?: string;
}

export function SeasonTabs({
  seasons,
  selectedSeason,
  onSeasonChange,
  className,
}: SeasonTabsProps) {
  return (
    <Tabs.Root
      value={selectedSeason}
      onValueChange={onSeasonChange}
      className={cn("w-full", className)}
    >
      <Tabs.List className="flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto">
        {seasons
          .filter((season) => season.isActive)
          .map((season) => (
            <Tabs.Trigger
              key={season.id}
              value={season.id}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "min-w-[100px] flex-shrink-0"
              )}
            >
              {season.name}
            </Tabs.Trigger>
          ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
