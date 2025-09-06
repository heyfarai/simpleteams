"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  FileText,
  Plus,
  Edit,
  Eye,
  Shield,
  MapPin,
  UserCheck,
  Archive,
  Play,
  CreditCard,
} from "lucide-react";
import {
  adminSampleData,
  sampleTeamRegistrations,
  sampleTeamInvoices,
  type AdminSeason,
} from "@/lib/admin-data";
import { LeagueTeamManagement } from "@/components/league-team-management";

export function AdminDashboard() {
  const [userRole] = useState("league_admin"); // Mock user role - would come from auth

  const dashboardStats = {
    totalSeasons: adminSampleData.seasons.length,
    activeSeasons: adminSampleData.seasons.filter((s) => s.isActive).length,
    totalTeams: adminSampleData.teams.length,
    totalLocations: adminSampleData.locations.length,
    totalOfficials: adminSampleData.officials.length,
    pendingTeams: sampleTeamRegistrations.filter((r) => r.status === "pending")
      .length,
    pendingPayments: sampleTeamInvoices.filter((i) => i.status === "pending")
      .length,
  };

  const activeSeasons = adminSampleData.seasons.filter((s) => s.isActive);
  const recentSeasons = adminSampleData.seasons.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="pageTitle mt-16 lg:mt-24 text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span className="text-gray-900">
              {userRole === "league_admin" ? "League Admin" : "Team Admin"}
            </span>
          </Badge>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Season
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
          <TabsTrigger value="seasons">Season Management</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalSeasons}
                </div>
                <div className="text-sm text-gray-600">Total Seasons</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.activeSeasons}
                </div>
                <div className="text-sm text-gray-600">Active Seasons</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalTeams}
                </div>
                <div className="text-sm text-gray-600">Teams</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalLocations}
                </div>
                <div className="text-sm text-gray-600">Locations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalOfficials}
                </div>
                <div className="text-sm text-gray-600">Officials</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.pendingTeams}
                </div>
                <div className="text-sm text-gray-600">Pending Teams</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.pendingPayments}
                </div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/admin/seasons/new">
                <Plus className="h-6 w-6" />
                Create Season
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/admin/teams/new">
                <Users className="h-6 w-6" />
                Register Team
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/admin/locations">
                <MapPin className="h-6 w-6" />
                Manage Locations
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/admin/officials">
                <UserCheck className="h-6 w-6" />
                Manage Officials
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Seasons */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  Active Seasons
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/admin/seasons">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSeasons.length > 0 ? (
                    activeSeasons.map((season) => (
                      <SeasonCard
                        key={season.id}
                        season={season}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-4">
                      No active seasons
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Seasons */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  All Seasons
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/admin/seasons">Manage</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSeasons.map((season) => (
                    <SeasonCard
                      key={season.id}
                      season={season}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      ONL-X Senior registered for 2024-25 Championship Season
                    </p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New location "Thunder Arena" added to system
                    </p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Kingmo Elite team registration pending approval
                    </p>
                    <p className="text-xs text-gray-600">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <LeagueTeamManagement />
        </TabsContent>

        <TabsContent
          value="seasons"
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Season Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Season management features will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="resources"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage league venues and facilities.
                </p>
                <Button asChild>
                  <Link href="/admin/locations">Manage Locations</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Officials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage referees and game officials.
                </p>
                <Button asChild>
                  <Link href="/admin/officials">Manage Officials</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SeasonCard({ season }: { season: AdminSeason }) {
  const totalConferences = season.conferences.length;
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
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{season.name}</h3>
          <p className="text-sm text-gray-600">
            {season.startDate} - {season.endDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={season.isActive ? "default" : "secondary"}>
            {season.status}
          </Badge>
          <Badge variant="outline">{season.type}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-lg font-bold text-gray-900">
            {totalConferences}
          </div>
          <div className="text-xs text-gray-600">Conferences</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {totalDivisions}
          </div>
          <div className="text-xs text-gray-600">Divisions</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{totalTeams}</div>
          <div className="text-xs text-gray-600">Teams</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          asChild
        >
          <Link href={`/admin/seasons/${season.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link href={`/admin/seasons/${season.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
