"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Heart } from "lucide-react";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";

interface TeamHeaderProps {
  team: {
    _id: string;
    name: string;
    logo?: any; // Sanity image object
    division?: {
      _id: string;
      name: string;
    };
    record?: string;
    awards?: string[];
    description?: string;
  };
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export function TeamHeader({ team, isFollowing, onToggleFollow }: TeamHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        <img
          src={getTeamLogoUrl(team.logo, 'small')}
          alt={`${team.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h1 className="pageTitle mt-16 lg:mt-24 text-4xl font-bold text-foreground mb-2">
          {team.name}
        </h1>
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onToggleFollow}
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Heart
              className={`h-4 w-4 ${isFollowing ? "fill-current" : ""}`}
            />
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {team.division?.name || 'No Division'}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {team.record || 'No Record'}
          </Badge>
          {team.awards && team.awards.length > 0 && (
            <Badge variant="default" className="text-sm bg-primary">
              <Trophy className="h-3 w-3 mr-1" />
              {team.awards[0]}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl">
          {team.description}
        </p>
      </div>
    </div>
  );
}
