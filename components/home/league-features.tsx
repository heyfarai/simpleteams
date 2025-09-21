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
        <div className="text-center md:text-left lg:w-3/4">
          <div className="">
            <h1 className="display-heading">Greatness Lives Here.</h1>
          </div>
          <h2 className="text-xl font-medium md:text-2xl mt-4 leading-7">
            Elite Features. <br />
            Feels Pro.
          </h2>
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
                Live On Camera. Every Play Counts.
              </h3>
              <p className="mt-1 text-muted-foreground">
                Professional broadcasts. Real-time highlights. Your moments
                amplified.
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
                Data Doesn't Lie. Your Stats Matter.
              </h3>
              <p className="mt-1 text-muted-foreground">
                Advanced analytics. Real-time insights. Performance unleashed.
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
                Be Seen. Be Heard. Be Legendary.
              </h3>
              <p className="mt-1 text-muted-foreground">
                Maximum exposure. Viral moments. Your story amplified.
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
                Together We Rise. United We Win.
              </h3>
              <p className="mt-1 text-muted-foreground">
                Community partnerships. Shared excellence. Collective greatness.
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
