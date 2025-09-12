"use client";

import { useEffect, useState } from "react";
import { fetchAllTeams } from "@/lib/data/fetch-teams";
import { Team } from "@/lib/types/teams";
import Image from "next/image";
import Link from "next/link";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";

export function LeagueTeamSpotlight() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeams() {
      try {
        const teamsData = await fetchAllTeams();
        setTeams(teamsData.slice(0, 16)); // Take first 4 teams
        setError(null);
      } catch (err) {
        setError("Failed to load teams");
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse text-center"
            >
              <div className="flex justify-center items-center size-12 bg-gray-200 rounded-full mx-auto" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <h2 className="font-bold text-3xl lg:text-4xl text-foreground text-center mb-10">
        Who plays in the NCHC?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="text-center block transition-transform hover:scale-105 hover:opacity-80"
          >
            <div className="flex justify-center items-center size-32  mx-auto dark:bg-neutral-800  overflow-hidden">
              <Image
                src={getTeamLogoUrl(team.logo)}
                alt={`${team.name} logo`}
                width={96}
                height={96}
                className="object-fill"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {team.name}
              </h3>
              <p className="mt-1 text-gray-600 dark:text-neutral-400">
                {team.region || "Location TBA"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
