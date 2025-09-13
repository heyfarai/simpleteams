"use client";

import Image from "next/image";
import {
  Trophy,
  Users2,
  Video,
  BarChart2,
  Instagram,
  Handshake,
} from "lucide-react";

export function LeagueFeatures() {
  return (
    <div className="max-w-[85rem] md:min-h-screen md:max-h-[600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto flex justify-center items-center">
      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="lg:w-3/4">
          <h2 className="font-black lg:text-8xl md:text-6xl text-5xl tracking-tight text-foreground text-center sm:text-left">
            More than just games
          </h2>
          <p className="mt-3 text-muted-foreground text-center sm:text-left">
            Get more than just basketball games with our comprehensive league
            features and services.
          </p>
        </div>
        {/* End Col */}

        <div className="space-y-6 lg:space-y-10">
          {/* Icon Block */}
          <div className="flex gap-x-5 sm:gap-x-8 group">
            {/* Icon */}
            <span className="shrink-0 inline-flex justify-center items-center h-11 w-11 rounded-full border bg-background text-foreground hover:bg-muted transition-colors group-hover:border-primary/50">
              <Video className="h-5 w-5" />
            </span>
            <div className="grow">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Live Streams & Broadcasts
              </h3>
              <p className="mt-1 text-muted-foreground">
                Watch games live on NCHC TV with professional commentary and
                replays.
              </p>
            </div>
          </div>
          {/* End Icon Block */}

          {/* Icon Block */}
          <div className="flex gap-x-5 sm:gap-x-8 group">
            {/* Icon */}
            <span className="shrink-0 inline-flex justify-center items-center h-11 w-11 rounded-full border bg-background text-foreground hover:bg-muted transition-colors group-hover:border-primary/50">
              <BarChart2 className="h-5 w-5" />
            </span>
            <div className="grow">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Live Advanced Statistics
              </h3>
              <p className="mt-1 text-muted-foreground">
                Real-time game stats and advanced analytics powered by SWISH.
              </p>
            </div>
          </div>
          {/* End Icon Block */}

          {/* Icon Block */}
          <div className="flex gap-x-5 sm:gap-x-8 group">
            {/* Icon */}
            <span className="shrink-0 inline-flex justify-center items-center h-11 w-11 rounded-full border bg-background text-foreground hover:bg-muted transition-colors group-hover:border-primary/50">
              <Instagram className="h-5 w-5" />
            </span>
            <div className="grow">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Enhanced Social Media Presence
              </h3>
              <p className="mt-1 text-muted-foreground">
                Increased exposure through our active social media channels and
                content.
              </p>
            </div>
          </div>
          {/* End Icon Block */}

          {/* Icon Block */}
          <div className="flex gap-x-5 sm:gap-x-8 group">
            {/* Icon */}
            <span className="shrink-0 inline-flex justify-center items-center h-11 w-11 rounded-full border bg-background text-foreground hover:bg-muted transition-colors group-hover:border-primary/50">
              <Handshake className="h-5 w-5" />
            </span>
            <div className="grow">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Community Partnerships
              </h3>
              <p className="mt-1 text-muted-foreground">
                Collaborations with local organizations and basketball
                communities.
              </p>
            </div>
          </div>
          {/* End Icon Block */}
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
}
