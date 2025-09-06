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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  UserPlus,
  Settings,
  Trophy,
  Calendar,
} from "lucide-react";
import {
  getDivisionById,
  getTeamsByDivision,
  adminSampleData,
  type AdminTeam,
} from "@/lib/admin-data";

export function DivisionDetail({ divisionId }: { divisionId: string }) {
  const division = getDivisionById(divisionId);
  const assignedTeams = getTeamsByDivision(divisionId);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  if (!division) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Division Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The requested division could not be found.
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

  const availableTeams = adminSampleData.teams.filter(
    (team) => !team.divisionId || team.divisionId !== divisionId
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          asChild
        >
          <Link href={`/admin/seasons/${division.seasonId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Season
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {division.name}
          </h1>
          <p className="text-muted-foreground">
            {division.description || "Division management"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {assignedTeams.length}
            {division.maxTeams ? `/${division.maxTeams}` : ""} Teams
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Division
          </Button>
        </div>
      </div>

      {/* Division Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {assignedTeams.length}
            </div>
            <div className="text-sm text-muted-foreground">Assigned Teams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {division.maxTeams
                ? division.maxTeams - assignedTeams.length
                : "∞"}
            </div>
            <div className="text-sm text-muted-foreground">Available Spots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Games Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserPlus className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {availableTeams.length}
            </div>
            <div className="text-sm text-muted-foreground">Available Teams</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned Teams
          </CardTitle>
          <div className="flex gap-2">
            <Dialog
              open={isAssignDialogOpen}
              onOpenChange={setIsAssignDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Existing Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Team to Division</DialogTitle>
                </DialogHeader>
                <TeamAssignmentForm
                  divisionId={divisionId}
                  availableTeams={availableTeams}
                  onClose={() => setIsAssignDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={isTeamDialogOpen}
              onOpenChange={setIsTeamDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Team
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Register New Team</DialogTitle>
                </DialogHeader>
                <TeamForm
                  divisionId={divisionId}
                  onClose={() => setIsTeamDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {assignedTeams.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No teams assigned
              </h3>
              <p className="text-muted-foreground mb-4">
                Register new teams or assign existing teams to this division
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Existing Team
                </Button>
                <Button onClick={() => setIsTeamDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Team
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  divisionId={divisionId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Division Limits Warning */}
      {division.maxTeams && assignedTeams.length >= division.maxTeams && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Division Full</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              This division has reached its maximum capacity of{" "}
              {division.maxTeams} teams.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TeamCard({
  team,
  divisionId,
}: {
  team: AdminTeam;
  divisionId: string;
}) {
  const primaryCoach =
    team.coaches.find((coach) => coach.role === "head") || team.coaches[0];
  const primaryContact =
    team.contacts.find((contact) => contact.isPrimary) || team.contacts[0];

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">{team.name}</h3>
              <Badge
                variant={team.status === "active" ? "default" : "secondary"}
              >
                {team.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              {primaryCoach && <p>Coach: {primaryCoach.name}</p>}
              {primaryContact && <p>Contact: {primaryContact.name}</p>}
              <p>Founded: {team.founded}</p>
              {team.homeVenue && <p>Home Venue: {team.homeVenue}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href={`/teams/${team.id}`}>View Profile</Link>
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
    </div>
  );
}

function TeamAssignmentForm({
  divisionId,
  availableTeams,
  onClose,
}: {
  divisionId: string;
  availableTeams: AdminTeam[];
  onClose: () => void;
}) {
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    // In a real app, this would update the team's division assignment
    console.log("Assigning team", selectedTeamId, "to division", divisionId);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="team-select"
          className="block text-sm font-medium mb-2"
        >
          Select Team to Assign
        </label>
        <Select
          value={selectedTeamId}
          onValueChange={setSelectedTeamId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a team..." />
          </SelectTrigger>
          <SelectContent>
            {availableTeams.map((team) => (
              <SelectItem
                key={team.id}
                value={team.id}
              >
                <div className="flex items-center gap-2">
                  <span>{team.name}</span>
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {team.status}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeamId && (
        <div className="p-3 border rounded-lg bg-muted/50">
          {(() => {
            const team = availableTeams.find((t) => t.id === selectedTeamId);
            if (!team) return null;
            const primaryCoach =
              team.coaches.find((coach) => coach.role === "head") ||
              team.coaches[0];
            return (
              <div>
                <h4 className="font-medium text-foreground">{team.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {primaryCoach && `Coach: ${primaryCoach.name} • `}
                  Founded: {team.founded}
                </p>
              </div>
            );
          })()}
        </div>
      )}

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
          disabled={!selectedTeamId}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Assign Team
        </Button>
      </div>
    </form>
  );
}

function TeamForm({
  divisionId,
  onClose,
}: {
  divisionId: string;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    founded: "",
    homeVenue: "",
    description: "",
    headCoachName: "",
    headCoachEmail: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the team and assign it to the division
    console.log("Creating team:", { ...formData, divisionId });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Team Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Team Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium mb-1"
            >
              Team Name *
            </label>
            <input
              id="team-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="e.g., ONL-X Senior"
              required
            />
          </div>
          <div>
            <label
              htmlFor="founded"
              className="block text-sm font-medium mb-1"
            >
              Founded Year
            </label>
            <input
              id="founded"
              type="text"
              value={formData.founded}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, founded: e.target.value }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="e.g., 2020"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="home-venue"
            className="block text-sm font-medium mb-1"
          >
            Home Venue
          </label>
          <input
            id="home-venue"
            type="text"
            value={formData.homeVenue}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, homeVenue: e.target.value }))
            }
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="e.g., Thunder Arena"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-input rounded-md"
            rows={3}
            placeholder="Brief description of the team"
          />
        </div>
      </div>

      {/* Head Coach */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Head Coach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="coach-name"
              className="block text-sm font-medium mb-1"
            >
              Coach Name *
            </label>
            <input
              id="coach-name"
              type="text"
              value={formData.headCoachName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  headCoachName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="e.g., Coach Martinez"
              required
            />
          </div>
          <div>
            <label
              htmlFor="coach-email"
              className="block text-sm font-medium mb-1"
            >
              Coach Email
            </label>
            <input
              id="coach-email"
              type="email"
              value={formData.headCoachEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  headCoachEmail: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="coach@team.com"
            />
          </div>
        </div>
      </div>

      {/* Primary Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium mb-1"
            >
              Contact Name *
            </label>
            <input
              id="contact-name"
              type="text"
              value={formData.contactName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="e.g., Team Manager"
              required
            />
          </div>
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-sm font-medium mb-1"
            >
              Phone Number
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium mb-1"
          >
            Contact Email *
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
            }
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="contact@team.com"
            required
          />
        </div>
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
          Register Team
        </Button>
      </div>
    </form>
  );
}
