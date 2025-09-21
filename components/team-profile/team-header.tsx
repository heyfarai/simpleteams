"use client";
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
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 mb-6 w-full text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        <img
          src={getTeamLogoUrl(team.logo, "small")}
          alt={`${team.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="">
        <h1 className="pageTitle mt-8 lg:mt-24 font-black lg:text-8xl md:text-6xl text-5xl tracking-tight text-foreground mb-2">
          {team.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{team.description}</p>
      </div>
    </div>
  );
}
