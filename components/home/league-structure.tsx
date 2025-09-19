"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Users2, CalendarDays, CheckCircle2 } from "lucide-react";
import { DivisionCTA } from "./league-divisions/division-cta";

export function LeagueStructure() {
  return (
    <div className="max-w-[85rem] min-h-screen md:max-h-[600px] px-4 sm:px-6 lg:px-8 mx-auto flex flex-col justify-center items-center">
      {/* Title */}
      <div className="text-center space-y-2 md:space-y-4 mb-24">
        <h1 className="font-black lg:text-8xl md:text-6xl text-4xl tracking-tight text-foreground">
          Play Hard.
        </h1>
        <h2 className="text-xl font-medium md:text-2xl mt-4 leading-7">
          Circuit Format Built For Champions
        </h2>
      </div>
      {/* End Title */}
      <div className="w-full lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
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
            {/* List */}
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    12 games. Every game matters.
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    5 sessions. Maximum flexibility.
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    Choose any 3 sessions that fit your schedule.
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    Playoffs. Where legends are made.
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    Professional officiating. Real competition.
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    FIBA rules with 24 sec shot clocks (14 sec reset).
                  </span>
                </span>
              </li>
              <li className="flex gap-x-3">
                <span className="mt-0.5 h-5 w-5 flex justify-center items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 />
                </span>
                <span className=" sm:text-base text-foreground">
                  <span className="font-semibold">
                    4 x 10 minute quarters (stop time) + adequate warmup.
                  </span>
                </span>
              </li>
            </ul>
            {/* End List */}
            <Link
              href="/pdf/NCHC-Season-2-Full-details.pdf"
              className="w-full sm:w-auto whitespace-nowrap py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm  rounded-full border border-transparent bg-gray-800 font-bold text-white hover:bg-gray-900 focus:outline-none focus:bg-primary/80 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
            >
              Learn more (PDF)
            </Link>
          </div>
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
}
