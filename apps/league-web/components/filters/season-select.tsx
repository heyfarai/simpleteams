import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Season } from "@/lib/utils/season-filters";

interface SeasonSelectProps {
  selectedSeason: string;
  seasons: Season[];
  onChange: (seasonId: string) => void;
  className?: string;
}

export function SeasonSelect({
  selectedSeason,
  seasons,
  onChange,
  className,
}: SeasonSelectProps) {
  const activeSeasons = React.useMemo(() => {
    return seasons
      .filter((season) => season.isActive && season.id !== "")
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [seasons]);

  return (
    <Select.Root
      value={selectedSeason || "all"}
      onValueChange={onChange}
    >
      <Select.Trigger
        className={cn(
          "flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <Select.Value>
          {activeSeasons.find((s) => s.id === selectedSeason)?.year ||
            (selectedSeason === "" ? "Select season" : "All seasons")}
        </Select.Value>
        <Select.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
          <Select.Viewport className="p-1">
            <Select.Item
              value="all"
              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Select.ItemIndicator>
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </span>
              <Select.ItemText>All seasons</Select.ItemText>
            </Select.Item>
            {activeSeasons.map((season) => (
              <Select.Item
                key={season.id}
                value={season.id}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{season.year}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
