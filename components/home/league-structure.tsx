"use client";

import Image from "next/image";
import { Trophy, Users2, CalendarDays, CheckCircle2 } from "lucide-react";

export function LeagueStructure() {
  return (
    <div className="max-w-[85rem] md:min-h-screen md:max-h-[600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto flex justify-center items-center">
      <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-2 sm:gap-6 items-center lg:-translate-x-10">
            <div className="col-span-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image
                  className="object-cover"
                  src="/basketball-game-action-shot-with-players-dunking.jpg"
                  alt="Game action shot"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            <div className="col-span-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image
                  className="object-cover"
                  src="/basketball-player-marcus-thompson-action-shot.jpg"
                  alt="Player action shot"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            </div>

            <div className="col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image
                  className="object-cover"
                  src="/basketball-player-portrait-action-shot.png"
                  alt="Player portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-10 lg:mt-0 lg:col-span-5">
          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="font-bold text-3xl lg:text-4xl text-foreground">
                Circuit Format
              </h2>
            </div>
            {/* End Title */}

            {/* List */}
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className="text-sm sm:text-base text-foreground">
                  <span className="font-normal">12 games per season</span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className="text-sm sm:text-base text-foreground">
                  <span className="font-normal">
                    5 game sessions per season (Monthly)
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className="text-sm sm:text-base text-foreground">
                  <span className="font-normal">
                    Teams play at any 3 sessions
                  </span>
                </span>
              </li>

              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className="text-sm sm:text-base text-foreground">
                  <span className="font-normal">Playoffs included</span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className="text-sm sm:text-base text-foreground">
                  <span className="font-normal">
                    Teams play at any 3 sessions
                  </span>
                </span>
              </li>
            </ul>
            {/* End List */}
          </div>
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
}
