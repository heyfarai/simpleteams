"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Game } from "@/lib/domain/models";

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Team {
  id: string;
  name: string;
  city?: string;
}

interface Season {
  id: string;
  name: string;
  year: number;
}

interface Division {
  id: string;
  name: string;
}

interface GameFormProps {
  game: Game | null;
  isCreatingNew?: boolean;
  onGameUpdated?: (updatedGame: Game) => void;
  onGameCreated?: (newGame: Game) => void;
}

export function GameForm({ game, isCreatingNew = false, onGameUpdated, onGameCreated }: GameFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    homeScore: "",
    awayScore: "",
    status: "upcoming",
    venueId: "",
    venue: "",
    homeTeamId: "",
    homeTeam: "",
    awayTeamId: "",
    awayTeam: "",
    divisionId: "",
    division: "",
    seasonId: "",
    season: "",
    isArchived: false,
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [divisionsLoading, setDivisionsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      setVenuesLoading(true);
      try {
        const response = await fetch("/api/venues");
        if (response.ok) {
          const venuesData = await response.json();
          setVenues(venuesData);
        }
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setVenuesLoading(false);
      }
    };

    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const response = await fetch("/api/teams/all-teams");
        if (response.ok) {
          const teamsData = await response.json();
          setTeams(teamsData);
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setTeamsLoading(false);
      }
    };

    const fetchSeasons = async () => {
      setSeasonsLoading(true);
      try {
        const response = await fetch("/api/seasons");
        if (response.ok) {
          const seasonsData = await response.json();
          setSeasons(seasonsData);
        }
      } catch (error) {
        console.error("Failed to fetch seasons:", error);
      } finally {
        setSeasonsLoading(false);
      }
    };

    const fetchDivisions = async () => {
      setDivisionsLoading(true);
      try {
        const response = await fetch("/api/divisions");
        if (response.ok) {
          const divisionsData = await response.json();
          setDivisions(divisionsData);
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
      } finally {
        setDivisionsLoading(false);
      }
    };

    fetchVenues();
    fetchTeams();
    fetchSeasons();
    fetchDivisions();
  }, []);

  // Update form data when game selection changes
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || "",
        date: game.date ? game.date.split("T")[0] : "",
        time: game.time || "",
        homeScore: game.homeScore?.toString() || "",
        awayScore: game.awayScore?.toString() || "",
        status: game.status || "upcoming",
        venueId: game.venue?.id || "",
        venue: game.venue?.name || "",
        homeTeamId: game.homeTeam?.id || "",
        homeTeam: game.homeTeam?.name || "",
        awayTeamId: game.awayTeam?.id || "",
        awayTeam: game.awayTeam?.name || "",
        divisionId: game.division?.id || "",
        division: game.division?.name || "",
        seasonId: game.season?.id || "",
        season: game.season?.name || "",
        isArchived: game.isArchived || false,
      });
    } else {
      // Reset form when no game selected
      setFormData({
        title: "",
        date: "",
        time: "",
        homeScore: "",
        awayScore: "",
        status: "upcoming",
        venueId: "",
        venue: "",
        homeTeamId: "",
        homeTeam: "",
        awayTeamId: "",
        awayTeam: "",
        divisionId: "",
        division: "",
        seasonId: "",
        season: "",
        isArchived: false,
      });
    }
  }, [game]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    // Validation for both create and update
    if (!formData.date || !formData.time) {
      setSaveError("Date and time are required");
      return;
    }

    if (isCreatingNew) {
      // For creating new games, we need team selection
      if (!formData.homeTeamId || !formData.awayTeamId) {
        setSaveError("Home and away teams are required");
        return;
      }
      if (!formData.seasonId) {
        setSaveError("Season is required");
        return;
      }
    } else if (!game?.id) {
      setSaveError("No game selected to save");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (isCreatingNew) {
        // Create new game
        const response = await fetch("/api/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: formData.date,
            time: formData.time,
            status: formData.status,
            homeTeamId: formData.homeTeamId,
            awayTeamId: formData.awayTeamId,
            seasonId: formData.seasonId,
            divisionId: formData.divisionId,
            venueId: formData.venueId,
            isArchived: formData.isArchived,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Game creation failed:", errorData);
          console.error("Request data:", {
            date: formData.date,
            time: formData.time,
            status: formData.status,
            homeTeamId: formData.homeTeamId,
            awayTeamId: formData.awayTeamId,
            seasonId: formData.seasonId,
            divisionId: formData.divisionId,
            venueId: formData.venueId,
            isArchived: formData.isArchived,
          });
          throw new Error(errorData.error || "Failed to create game");
        }

        const result = await response.json();
        setSaveSuccess(true);
        console.log("Game created successfully:", result);

        // Notify parent component of the new game
        if (onGameCreated && result.game) {
          onGameCreated(result.game);
        }
      } else {
        // Update existing game
        const response = await fetch(`/api/games/${game!.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: formData.date,
            time: formData.time,
            status: formData.status,
            homeScore: formData.homeScore
              ? parseInt(formData.homeScore)
              : undefined,
            awayScore: formData.awayScore
              ? parseInt(formData.awayScore)
              : undefined,
            venueId: formData.venueId,
            isArchived: formData.isArchived,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save game");
        }

        const result = await response.json();
        setSaveSuccess(true);
        console.log("Game saved successfully:", result);

        // Notify parent component of the updated game
        if (onGameUpdated && result.game) {
          onGameUpdated(result.game);
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving game:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save game"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (game) {
      // Reset to original game data
      setFormData({
        title: game.title || "",
        date: game.date ? game.date.split("T")[0] : "",
        time: game.time || "",
        homeScore: game.homeScore?.toString() || "",
        awayScore: game.awayScore?.toString() || "",
        status: game.status || "upcoming",
        venueId: game.venue?.id || "",
        venue: game.venue?.name || "",
        homeTeamId: game.homeTeam?.id || "",
        homeTeam: game.homeTeam?.name || "",
        awayTeamId: game.awayTeam?.id || "",
        awayTeam: game.awayTeam?.name || "",
        divisionId: game.division?.id || "",
        division: game.division?.name || "",
        seasonId: game.season?.id || "",
        season: game.season?.name || "",
        isArchived: game.isArchived || false,
      });
    }
  };

  if (!game && !isCreatingNew) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Select a game to edit or click Add to create a new game</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Game Info Header */}
      {!isCreatingNew && game && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Game ID</h3>
          <p className="text-xs font-mono bg-gray-50 p-2 rounded border break-all">
            {game.id}
          </p>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isArchived"
          checked={formData.isArchived}
          onChange={(e) => handleInputChange("isArchived", e.target.checked)}
          className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
        />
        <Label
          htmlFor="isArchived"
          className="text-sm"
        >
          Archive game (hide from public view)
        </Label>
      </div>
      {formData.isArchived && (
        <p className="text-xs text-muted-foreground">
          Archived games are hidden from the public schedule but remain
          accessible in the admin interface.
        </p>
      )}
      <Separator />

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Basic Information</h3>

        <div className="hidden space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Game title"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Scores */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Scores</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="homeScore">Home Score</Label>
            <Input
              id="homeScore"
              type="number"
              value={formData.homeScore}
              onChange={(e) => handleInputChange("homeScore", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore">Away Score</Label>
            <Input
              id="awayScore"
              type="number"
              value={formData.awayScore}
              onChange={(e) => handleInputChange("awayScore", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Location & Context */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Location & Context</h3>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Select
            value={formData.venueId}
            onValueChange={(value) => {
              const selectedVenue = venues.find((v) => v.id === value);
              handleInputChange("venueId", value);
              handleInputChange("venue", selectedVenue?.name || "");
            }}
            disabled={venuesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  venuesLoading ? "Loading venues..." : "Select venue"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem
                  key={venue.id}
                  value={venue.id}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{venue.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {venue.address}, {venue.city}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="division">Division</Label>
          <Select
            value={formData.divisionId}
            onValueChange={(value) => {
              const selectedDivision = divisions.find((d) => d.id === value);
              handleInputChange("divisionId", value);
              handleInputChange("division", selectedDivision?.name || "");
            }}
            disabled={divisionsLoading || !isCreatingNew}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  divisionsLoading ? "Loading divisions..." : isCreatingNew ? "Select division" : formData.division
                }
              />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem
                  key={division.id}
                  value={division.id}
                >
                  <span className="font-medium">{division.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Select
            value={formData.seasonId}
            onValueChange={(value) => {
              const selectedSeason = seasons.find((s) => s.id === value);
              handleInputChange("seasonId", value);
              handleInputChange("season", selectedSeason?.name || "");
            }}
            disabled={seasonsLoading || !isCreatingNew}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  seasonsLoading ? "Loading seasons..." : isCreatingNew ? "Select season" : formData.season
                }
              />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem
                  key={season.id}
                  value={season.id}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{season.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {season.year}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Teams */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Teams</h3>

        <div className="space-y-2">
          <Label htmlFor="homeTeam">Home Team</Label>
          <Select
            value={formData.homeTeamId}
            onValueChange={(value) => {
              const selectedTeam = teams.find((t) => t.id === value);
              handleInputChange("homeTeamId", value);
              handleInputChange("homeTeam", selectedTeam?.name || "");
            }}
            disabled={teamsLoading || !isCreatingNew}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  teamsLoading ? "Loading teams..." : isCreatingNew ? "Select home team" : formData.homeTeam
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem
                  key={team.id}
                  value={team.id}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{team.name}</span>
                    {team.city && (
                      <span className="text-xs text-muted-foreground">
                        {team.city}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="awayTeam">Away Team</Label>
          <Select
            value={formData.awayTeamId}
            onValueChange={(value) => {
              const selectedTeam = teams.find((t) => t.id === value);
              handleInputChange("awayTeamId", value);
              handleInputChange("awayTeam", selectedTeam?.name || "");
            }}
            disabled={teamsLoading || !isCreatingNew}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  teamsLoading ? "Loading teams..." : isCreatingNew ? "Select away team" : formData.awayTeam
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem
                  key={team.id}
                  value={team.id}
                  disabled={team.id === formData.homeTeamId}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{team.name}</span>
                    {team.city && (
                      <span className="text-xs text-muted-foreground">
                        {team.city}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Status Messages */}
      {saveError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
          Game saved successfully!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSaving}
          className="flex-1"
        >
          Reset
        </Button>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-muted-foreground pt-4 border-t">
        <p>Game admin form - saves changes to the database</p>
      </div>
    </div>
  );
}
