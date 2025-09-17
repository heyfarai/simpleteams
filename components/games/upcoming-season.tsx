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
      simpleDate: "November 1-2, 2025",
      location: "TBC",
    },
    {
      _id: "2",
      name: "Heart of the Capital",
      simpleDate: "December 20-21, 2025",
      location: "TBC",
    },
    {
      _id: "3",
      name: "East Capital",
      simpleDate: "January 31- February 1, 2026",
      location: "TBC",
    },
    {
      _id: "4",
      name: "Quebec",
      simpleDate: "February 28 - March 1, 2026",
      location: "TBC",
    },
    {
      _id: "5",
      name: "Ontario East",
      simpleDate: "March 7 - 8, 2026",
      location: "TBC",
    },
    {
      _id: "6",
      name: "Championship Weekend",
      simpleDate: "March 27 - 29, 2026",
      location: "TBC",
    },
  ],
};
export function UpcomingSeason() {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="seasonteaser">
        <div className="space-y-4">
          <p className="text-normal text-foreground/50">
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
      <div className="seasonsessions mt-12 p-2">
        {season.sessions.map((session, index) => (
          <div
            key={session._id}
            className={`session flex flex-col md:flex-row justify-between gap-4 border border-b-0 border-[#e0ddd9] p-6 ${
              index === 0 ? "rounded-t-lg" : ""
            } ${
              index === season.sessions.length - 1
                ? "rounded-b-lg border-b-1"
                : ""
            }`}
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
