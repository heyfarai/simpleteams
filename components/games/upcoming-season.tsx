"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

const season = {
  name: "2025-26 Regular Season",
  sessions: [
    {
      _id: "1",
      name: "West Capital",
      simpleDate: "November 1-2",
      location: "TBC",
    },
    {
      _id: "2",
      name: "Heart of the Capital",
      simpleDate: "December 20-21",
      location: "TBC",
    },
    {
      _id: "3",
      name: "East Capital",
      simpleDate: "January 31- February 1",
      location: "TBC",
    },
    {
      _id: "4",
      name: "Quebec",
      simpleDate: "February 28 - March 1",
      location: "TBC",
    },
    {
      _id: "5",
      name: "Ontario East",
      simpleDate: "March 7 - 8",
      location: "TBC",
    },
    {
      _id: "6",
      name: "Championship Weekend",
      simpleDate: "March 27 - 29",
      location: "TBC",
    },
  ],
};
export function UpcomingSeason() {
  return (
    <div className="text-center py-4 space-y-6">
      <div className="seasonteaser">
        <h2 className="text-2xl font-bold">2025-26 Season Dropping Soon</h2>
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Full schedule drops in October 2025.
          </p>
          <div className="hidden flex-col gap-2 items-center">
            <p className="text-sm text-muted-foreground">
              Want to be notified when registration opens?
            </p>
            <Button asChild>
              <Link href="/register">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="seasonsessions mt-12">
        {season.sessions.map((session) => (
          <div
            key={session._id}
            className="session flex flex-col md:flex-row justify-between gap-4 border-t border-muted-foreground md:px-0 py-6"
          >
            <div className="flex flex-col items-start gap-0.5">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{session.simpleDate}</span>
              </div>
              <h3 className="text-lg font-bold mb-0 mt-0">
                {session.name}{" "}
                <span className=" text-muted-foreground font-light">
                  Session
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Games and Location: {session.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
