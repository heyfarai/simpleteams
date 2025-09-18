"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Menu, X } from "lucide-react";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";
import { fetchTeams } from "@/lib/data/fetch-teams";
import type { Team } from "@/lib/sanity/display-types";

interface Video {
  id: string;
  title: string;
  thumbnail: string | null;
  duration: string;
  date: string;
  teams: string;
  views: number;
  type: "highlights" | "full_game" | "popular" | "recap" | "replay";
}

export function MediaWatchSection() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams();
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  // Sample video data
  const popularVideos: Video[] = [
    {
      id: "5",
      title: "Last Night's Game Recap",
      thumbnail: null,
      duration: "5:20",
      date: "2025-01-22",
      teams: "Brockville Blazers vs Young Guns",
      views: 1200,
      type: "recap",
    },
    {
      id: "6",
      title: "Weekly Division Roundup",
      thumbnail: null,
      duration: "12:15",
      date: "2025-01-21",
      teams: "All Teams",
      views: 890,
      type: "recap",
    },
    {
      id: "7",
      title: "Player Interview: Maya Anderson",
      thumbnail: null,
      duration: "7:30",
      date: "2025-01-20",
      teams: "Phoenix Rising",
      views: 1500,
      type: "popular",
    },
    {
      id: "8",
      title: "Practice Session Behind Scenes",
      thumbnail: null,
      duration: "9:45",
      date: "2025-01-19",
      teams: "Kingmo Elite",
      views: 650,
      type: "popular",
    },
  ];

  const recentVideos: Video[] = [
    {
      id: "1",
      title: "Championship Finals Highlights",
      thumbnail: null,
      duration: "8:45",
      date: "2025-01-23",
      teams: "All Teams",
      views: 3200,
      type: "highlights",
    },
    {
      id: "2",
      title: "Game Recap: Intense Overtime",
      thumbnail: null,
      duration: "3:30",
      date: "2025-01-22",
      teams: "Phoenix Rising vs Elite Squad",
      views: 1800,
      type: "recap",
    },
  ];

  const highlightVideos: Video[] = [
    {
      id: "9",
      title: "Top 10 Plays This Week",
      thumbnail: null,
      duration: "6:20",
      date: "2025-01-21",
      teams: "All Teams",
      views: 2800,
      type: "highlights",
    },
    {
      id: "10",
      title: "Clutch Shots Compilation",
      thumbnail: null,
      duration: "4:15",
      date: "2025-01-20",
      teams: "All Teams",
      views: 2100,
      type: "highlights",
    },
    {
      id: "11",
      title: "Best Defensive Plays",
      thumbnail: null,
      duration: "5:45",
      date: "2025-01-18",
      teams: "All Teams",
      views: 1900,
      type: "highlights",
    },
    {
      id: "12",
      title: "Rookie Highlights Reel",
      thumbnail: null,
      duration: "8:30",
      date: "2025-01-16",
      teams: "All Teams",
      views: 1600,
      type: "highlights",
    },
  ];

  const filterVideos = (videos: Video[]) => {
    return videos.filter((video) => {
      const matchesYear =
        selectedYear === "all" || video.date.includes(selectedYear);
      const matchesDivision = selectedDivision === "all" || true; // Would need division data
      const matchesTeam =
        selectedTeam === "all" ||
        video.teams.includes(selectedTeam) ||
        video.teams === "All Teams";
      const matchesType = selectedType === "all" || video.type === selectedType;
      return matchesYear && matchesDivision && matchesTeam && matchesType;
    });
  };

  return (
    <div className="flex gap-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar Filters */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 lg:w-64 bg-background border-r z-40 p-6 space-y-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">YEAR</label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">DIVISION</label>
              <Select
                value={selectedDivision}
                onValueChange={setSelectedDivision}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">TEAM</label>
              <Select
                value={selectedTeam}
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem
                      key={team._id}
                      value={team.name}
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">TYPE</label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="recap">RECAP</SelectItem>
                  <SelectItem value="replay">REPLAY</SelectItem>
                  <SelectItem value="highlights">HIGHLIGHT</SelectItem>
                  <SelectItem value="full_game">FULL GAMES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 space-y-8 lg:ml-0 ml-0">
        {/* Popular Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">Popular</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filterVideos(popularVideos).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
              />
            ))}
          </div>
        </div>

        {/* Recent Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">Recent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filterVideos(recentVideos).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
              />
            ))}
          </div>
        </div>

        {/* Highlights Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filterVideos(highlightVideos).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
              />
            ))}
          </div>
        </div>

        {/* Teams Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">Teams</h2>
          <div className="flex flex-wrap gap-5">
            {teams.map((team) => (
              <div
                key={team._id}
                className="flex flex-col items-center space-y-2 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-muted group-hover:border-primary transition-colors">
                  <img
                    src={getTeamLogoUrl(team.logo, "small")}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-center font-medium group-hover:text-primary transition-colors">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
            {video.duration}
          </div>
        </div>

        <div className="p-3 space-y-1">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {video.teams}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.views.toLocaleString()} views</span>
            <span>{new Date(video.date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
