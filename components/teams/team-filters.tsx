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
  years: string[];
  seasons: Array<{
    _id: string;
    name: string;
    year: number;
    activeDivisions: Array<{
      division: { _ref: string };
      status: string;
    }>;
  }>;
  divisions: Array<{
    _id: string;
    name: string;
    season: { _ref: string };
  }>;
  awards: string[];
  isMobile?: boolean;
  onClose?: () => void;
}

export function TeamFilters({
  filters,
  onFilterChange,
  divisions,
  years,
  seasons,
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
      year: "",
      seasonId: "",
      divisionId: undefined,
      awards: []
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

      {/* Year Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Year *</label>
        <Select
          value={filters.year}
          onValueChange={(value) => {
            // Clear season when year changes
            onFilterChange({ 
              year: value,
              seasonId: "",
              divisionId: undefined
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Season *</label>
        <Select
          value={filters.seasonId}
          onValueChange={(value) => {
            // Clear division when season changes
            onFilterChange({ 
              seasonId: value,
              divisionId: undefined
            });
          }}
          disabled={!filters.year}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {seasons
              .filter((season: { year: number }) => season.year.toString() === filters.year)
              .map((season: { _id: string, name: string }) => (
                <SelectItem key={season._id} value={season._id}>
                  {season.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Division Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Division</label>
        <Select
          value={filters.divisionId || "all"}
          onValueChange={(value) => onFilterChange({ divisionId: value === "all" ? undefined : value })}
          disabled={!filters.seasonId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {divisions
              .filter(division => division.season._ref === filters.seasonId)
              .map((division) => (
                <SelectItem key={division._id} value={division._id}>
                  {division.name}
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
