"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Users,
  Settings,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  getAdminSeasonById,
  getAdminSessionsBySeasonId,
  getAdminGamesBySessionId,
  type AdminConference,
  type AdminDivision,
  type AdminGame,
} from "@/lib/admin-data";

export function SeasonDetail({ seasonId }: { seasonId: string }) {
  const season = getAdminSeasonById(seasonId);
  const sessions = getAdminSessionsBySeasonId(seasonId);
  const [activeTab, setActiveTab] = useState("schedule");
  const [expandedConferences, setExpandedConferences] = useState<Set<string>>(
    new Set()
  );
  const [isConferenceDialogOpen, setIsConferenceDialogOpen] = useState(false);
  const [isDivisionDialogOpen, setIsDivisionDialogOpen] = useState(false);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const [selectedConferenceId, setSelectedConferenceId] = useState<string>("");

  if (!season) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Season Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The requested season could not be found.
            </p>
            <Button asChild>
              <Link href="/admin/seasons">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Seasons
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleConference = (conferenceId: string) => {
    const newExpanded = new Set(expandedConferences);
    if (newExpanded.has(conferenceId)) {
      newExpanded.delete(conferenceId);
    } else {
      newExpanded.add(conferenceId);
    }
    setExpandedConferences(newExpanded);
  };

  const totalDivisions = season.conferences.reduce(
    (acc, conf) => acc + conf.divisions.length,
    0
  );
  const totalTeams = season.conferences.reduce(
    (acc, conf) =>
      acc +
      conf.divisions.reduce((divAcc, div) => divAcc + div.teams.length, 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          asChild
        >
          <Link href="/admin/seasons">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Seasons
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {season.name}
          </h1>
          <p className="text-muted-foreground">
            {new Date(season.startDate).toLocaleDateString()} -{" "}
            {new Date(season.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={season.isActive ? "default" : "secondary"}>
            {season.status}
          </Badge>
          <Badge variant="outline">{season.type}</Badge>
          <Button
            variant="outline"
            asChild
          >
            <Link href={`/admin/seasons/${season.id}/edit`}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Season
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Season Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="grid w-full grid-rows-2 h-auto bg-transparent p-2">
                  <TabsTrigger
                    value="schedule"
                    className="justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger
                    value="structure"
                    className="justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users className="h-4 w-4" />
                    Structure
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Conferences
                </span>
                <span className="font-medium">{season.conferences.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Divisions</span>
                <span className="font-medium">{totalDivisions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teams</span>
                <span className="font-medium">{totalTeams}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <span className="font-medium">{sessions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsContent
              value="schedule"
              className="mt-0"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Management
                  </CardTitle>
                  <Dialog
                    open={isGameDialogOpen}
                    onOpenChange={setIsGameDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Game
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Schedule New Game</DialogTitle>
                      </DialogHeader>
                      <GameForm
                        seasonId={season.id}
                        onClose={() => setIsGameDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No sessions scheduled
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first session to start scheduling games
                      </p>
                      <Button onClick={() => setIsGameDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule First Game
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sessions.map((session) => {
                        const sessionGames = getAdminGamesBySessionId(
                          session.id
                        );
                        return (
                          <SessionScheduleCard
                            key={session.id}
                            session={session}
                            games={sessionGames}
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="structure"
              className="mt-0"
            >
              {/* Conference & Division Tree */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Conference & Division Structure
                  </CardTitle>
                  <Dialog
                    open={isConferenceDialogOpen}
                    onOpenChange={setIsConferenceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Conference
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Conference</DialogTitle>
                      </DialogHeader>
                      <ConferenceForm
                        seasonId={season.id}
                        onClose={() => setIsConferenceDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {season.conferences.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No conferences yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first conference to organize teams into
                        divisions
                      </p>
                      <Button onClick={() => setIsConferenceDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Conference
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {season.conferences.map((conference) => (
                        <ConferenceTreeItem
                          key={conference.id}
                          conference={conference}
                          isExpanded={expandedConferences.has(conference.id)}
                          onToggle={() => toggleConference(conference.id)}
                          onAddDivision={() => {
                            setSelectedConferenceId(conference.id);
                            setIsDivisionDialogOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Division Dialog */}
      <Dialog
        open={isDivisionDialogOpen}
        onOpenChange={setIsDivisionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Division</DialogTitle>
          </DialogHeader>
          <DivisionForm
            conferenceId={selectedConferenceId}
            seasonId={season.id}
            onClose={() => setIsDivisionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConferenceTreeItem({
  conference,
  isExpanded,
  onToggle,
  onAddDivision,
}: {
  conference: AdminConference;
  isExpanded: boolean;
  onToggle: () => void;
  onAddDivision: () => void;
}) {
  const totalTeams = conference.divisions.reduce(
    (acc, div) => acc + div.teams.length,
    0
  );

  return (
    <div className="border rounded-lg">
      {/* Conference Header */}
      <div className="flex items-center justify-between p-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div>
            <h3 className="font-semibold text-foreground">{conference.name}</h3>
            <p className="text-sm text-muted-foreground">
              {conference.divisions.length} divisions • {totalTeams} teams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddDivision}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Division
          </Button>
          <Button
            variant="ghost"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Divisions */}
      {isExpanded && (
        <div className="p-4 pt-0">
          {conference.divisions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground mb-2">
                No divisions in this conference
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddDivision}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Division
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {conference.divisions.map((division) => (
                <DivisionTreeItem
                  key={division.id}
                  division={division}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DivisionTreeItem({ division }: { division: AdminDivision }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-background ml-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <div>
          <h4 className="font-medium text-foreground">{division.name}</h4>
          <p className="text-sm text-muted-foreground">
            {division.teams.length} teams
            {division.maxTeams && ` • Max: ${division.maxTeams}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link href={`/admin/divisions/${division.id}`}>
            <Users className="h-4 w-4 mr-2" />
            Manage Teams
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ConferenceForm({
  seasonId,
  onClose,
}: {
  seasonId: string;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    console.log("Creating conference:", { ...formData, seasonId });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="conf-name">Conference Name *</Label>
        <Input
          id="conf-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Eastern Conference"
          required
        />
      </div>
      <div>
        <Label htmlFor="conf-description">Description</Label>
        <Textarea
          id="conf-description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Optional description"
          rows={3}
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Create Conference
        </Button>
      </div>
    </form>
  );
}

function DivisionForm({
  conferenceId,
  seasonId,
  onClose,
}: {
  conferenceId: string;
  seasonId: string;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxTeams: "",
    minTeams: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    console.log("Creating division:", { ...formData, conferenceId, seasonId });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="div-name">Division Name *</Label>
        <Input
          id="div-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Diamond Division"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min-teams">Minimum Teams</Label>
          <Input
            id="min-teams"
            type="number"
            value={formData.minTeams}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, minTeams: e.target.value }))
            }
            placeholder="4"
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="max-teams">Maximum Teams</Label>
          <Input
            id="max-teams"
            type="number"
            value={formData.maxTeams}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, maxTeams: e.target.value }))
            }
            placeholder="8"
            min="1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="div-description">Description</Label>
        <Textarea
          id="div-description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Optional description"
          rows={3}
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Create Division
        </Button>
      </div>
    </form>
  );
}

function SessionScheduleCard({
  session,
  games,
}: {
  session: any;
  games: AdminGame[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg">
      <div className="flex items-center justify-between p-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div>
            <h3 className="font-semibold text-foreground">{session.name}</h3>
            <p className="text-sm text-muted-foreground">
              {session.type} • {games.length} games scheduled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={session.type === "Regular" ? "default" : "secondary"}>
            {session.type}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          {games.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground">
                No games scheduled for this session
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GameCard({ game }: { game: AdminGame }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-sm font-medium">
            {new Date(game.dateTime).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(game.dateTime).toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{game.homeTeam}</span>
          <span className="text-muted-foreground">vs</span>
          <span className="font-medium">{game.awayTeam}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {game.location}
        </div>
        <Badge
          variant="outline"
          className="text-xs"
        >
          {game.status}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function GameForm({
  seasonId,
  onClose,
}: {
  seasonId: string;
  onClose: () => void;
}) {
  const season = getAdminSeasonById(seasonId);
  const sessions = getAdminSessionsBySeasonId(seasonId);
  const [formData, setFormData] = useState({
    sessionId: "",
    homeTeam: "",
    awayTeam: "",
    dateTime: "",
    location: "",
    division: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating game:", { ...formData, seasonId });
    onClose();
  };

  if (!season) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="session">Session *</Label>
          <Select
            value={formData.sessionId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, sessionId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem
                  key={session.id}
                  value={session.id}
                >
                  {session.name} ({session.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {season.locations.map((location) => (
                <SelectItem
                  key={location}
                  value={location}
                >
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="home-team">Home Team *</Label>
          <Input
            id="home-team"
            value={formData.homeTeam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, homeTeam: e.target.value }))
            }
            placeholder="Select home team"
            required
          />
        </div>
        <div>
          <Label htmlFor="away-team">Away Team *</Label>
          <Input
            id="away-team"
            value={formData.awayTeam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, awayTeam: e.target.value }))
            }
            placeholder="Select away team"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="date-time">Date & Time *</Label>
        <Input
          id="date-time"
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dateTime: e.target.value }))
          }
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Schedule Game
        </Button>
      </div>
    </form>
  );
}
