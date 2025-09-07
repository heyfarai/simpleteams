"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, X } from "lucide-react";
import { TeamFilterState } from "@/lib/types/teams";

interface TeamFiltersProps {
  filters: TeamFilterState;
  onFilterChange: (filters: Partial<TeamFilterState>) => void;
  divisions: string[];
  years: string[];
  sessions: string[];
  awards: string[];
  isMobile?: boolean;
  onClose?: () => void;
}

export function TeamFilters({
  filters,
  onFilterChange,
  divisions,
  years,
  sessions,
  awards,
  isMobile,
  onClose,
}: TeamFiltersProps) {
  const handleAwardToggle = (award: string) => {
    const newAwards = filters.awards.includes(award)
      ? filters.awards.filter((a) => a !== award)
      : [...filters.awards, award];
    onFilterChange({ awards: newAwards });
  };

  const clearFilters = () => {
    onFilterChange({
      searchTerm: "",
      division: "all",
      year: "all",
      session: "all",
      awards: [],
    });
  };

  const FilterContent = () => (
    <div className={`space-y-6 ${isMobile ? "p-4" : ""}`}>
      {/* Search */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams, regions, coaches..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Division Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Division</label>
        <Select
          value={filters.division}
          onValueChange={(value) => onFilterChange({ division: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {divisions.map((division) => (
              <SelectItem key={division} value={division}>
                {division}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
        <Select
          value={filters.year}
          onValueChange={(value) => onFilterChange({ year: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Session Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Session</label>
        <Select
          value={filters.session}
          onValueChange={(value) => onFilterChange({ session: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {sessions.map((session) => (
              <SelectItem key={session} value={session}>
                {session}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Awards Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Awards</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {awards.map((award) => (
            <div key={award} className="flex items-center space-x-2">
              <Checkbox
                id={`award-${award}`}
                checked={filters.awards.includes(award)}
                onCheckedChange={() => handleAwardToggle(award)}
              />
              <label
                htmlFor={`award-${award}`}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {award}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full bg-transparent"
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Card className="lg:hidden">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FilterContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
