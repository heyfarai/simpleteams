"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar, Filter, X } from "lucide-react";
import { SeasonSelect } from "@/components/filters/season-select";
import { Season } from "@/lib/utils/season-filters";

interface FilterData {
  seasons: Array<{ _id: string; name: string; year: number }>;
  sessions: Array<{ _id: string; name: string }>;
  divisions: Array<{ _id: string; name: string }>;
}

interface GameFiltersProps {
  filterData: FilterData;
  selectedSeason: string;
  selectedSession: string;
  selectedDivision: string;
  onSeasonChange: (value: string) => void;
  onSessionChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onClearAll: () => void;
  activeFiltersCount: number;
  showMobileFilters?: boolean;
  onToggleMobileFilters?: () => void;
}

export function GameFilters({
  filterData,
  selectedSeason,
  selectedSession,
  selectedDivision,
  onSeasonChange,
  onSessionChange,
  onDivisionChange,
  onClearAll,
  activeFiltersCount,
  showMobileFilters = false,
  onToggleMobileFilters,
}: GameFiltersProps) {
  const divisions = [
    { _id: "all", name: "All Divisions" },
    ...(filterData.divisions || []),
  ];
  const sessions = [
    { _id: "all", name: "All Sessions" },
    ...(filterData.sessions || []),
  ];
  const seasons: Season[] = [
    {
      id: "all",
      name: "All Seasons",
      year: "All",
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    },
    ...(filterData.seasons || []).map((season) => ({
      id: season._id,
      name: season.name,
      year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
      startDate: new Date(season.year, 8, 1),
      endDate: new Date(season.year + 1, 7, 31),
      isActive: true,
    })),
  ];

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Season Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Season</label>
                <SeasonSelect
                  selectedSeason={selectedSeason}
                  seasons={seasons}
                  onChange={onSeasonChange}
                />
              </div>

              {/* Session Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Session</label>
                <Select
                  value={selectedSession}
                  onValueChange={onSessionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem
                        key={session._id}
                        value={session._id}
                      >
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Division Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Division</label>
                <Select
                  value={selectedDivision}
                  onValueChange={onDivisionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem
                        key={division._id}
                        value={division._id}
                      >
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggleMobileFilters}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </span>
          {showMobileFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>

        {showMobileFilters && (
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SeasonSelect
                  selectedSeason={selectedSeason}
                  seasons={seasons}
                  onChange={onSeasonChange}
                />

                <Select
                  value={selectedSession}
                  onValueChange={onSessionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map((session) => (
                      <SelectItem
                        key={session._id}
                        value={session._id}
                      >
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDivision}
                  onValueChange={onDivisionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem
                        key={division._id}
                        value={division._id}
                      >
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                >
                  Clear All
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
