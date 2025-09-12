"use client";

import Image from "next/image";
import { useState } from "react";
import { Trophy, Users2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "tab-1" | "tab-2" | "tab-3" | "tab-4";

export function LeagueDivisions() {
  const [activeTab, setActiveTab] = useState<TabId>("tab-1");

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="relative p-6 md:p-16">
        {/* Grid */}
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
            <h2 className="hidden text-2xl font-bold text-foreground sm:text-3xl">
              4 Divisions
            </h2>

            {/* Tab Navs */}
            <nav
              className="grid gap-4 mt-5 md:mt-10"
              aria-label="Tabs"
              role="tablist"
              aria-orientation="vertical"
            >
              <button
                type="button"
                onClick={() => setActiveTab("tab-1")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-1" &&
                    "bg-white shadow-md dark:bg-neutral-800"
                )}
                id="tab-1"
                role="tab"
                aria-selected={activeTab === "tab-1"}
                aria-controls="tab-panel-1"
              >
                <span className="flex gap-x-6">
                  <Trophy className="h-5 w-5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold text-foreground">
                      Diamond Division
                    </span>
                    <span className="block mt-1 text-muted-foreground">
                      Grade 12+ | Senior Prep | CEGEP D1 | U19/Mens
                    </span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tab-2")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-2" &&
                    "bg-white shadow-md dark:bg-neutral-800"
                )}
                id="tab-2"
                role="tab"
                aria-selected={activeTab === "tab-2"}
                aria-controls="tab-panel-2"
              >
                <span className="flex gap-x-6">
                  <Users2 className="h-5 w-5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold text-foreground">
                      Premier Division
                    </span>
                    <span className="block mt-1 text-muted-foreground">
                      Grade 11 | Grade 12 AA | JUNIOR Prep | CEGEP D2 | U17-U18
                    </span>
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tab-3")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-3" &&
                    "bg-white shadow-md dark:bg-neutral-800"
                )}
                id="tab-3"
                role="tab"
                aria-selected={activeTab === "tab-3"}
                aria-controls="tab-panel-3"
              >
                <span className="flex gap-x-6">
                  <CalendarDays className="h-5 w-5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold text-foreground">
                      Supreme Division
                    </span>
                    <span className="block mt-1 text-muted-foreground">
                      Grade 10+ | Junior Prep | Juvenile Gars | U16 AAA
                    </span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tab-3")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-3" &&
                    "bg-white shadow-md dark:bg-neutral-800"
                )}
                id="tab-3"
                role="tab"
                aria-selected={activeTab === "tab-3"}
                aria-controls="tab-panel-3"
              >
                <span className="flex gap-x-6">
                  <CalendarDays className="h-5 w-5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold text-foreground">
                      Ascent Division
                    </span>
                    <span className="block mt-1 text-muted-foreground">
                      Grade 9+ | CADET GARS | U15 AAA | U16 AA
                    </span>
                  </span>
                </span>
              </button>
            </nav>
            {/* End Tab Navs */}
          </div>
          {/* End Col */}

          <div className="lg:col-span-6">
            <div className="relative">
              {/* Tab Content */}
              <div>
                <div
                  id="tab-panel-1"
                  role="tabpanel"
                  aria-labelledby="tab-1"
                  className={cn("transition-opacity duration-200", {
                    "opacity-100": activeTab === "tab-1",
                    "opacity-0 hidden": activeTab !== "tab-1",
                  })}
                >
                  <div className="relative aspect-[4/5] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      className="object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20"
                      src="/basketball-game-action-shot-with-players-dunking.jpg"
                      alt="Game action shot"
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      priority
                    />
                  </div>
                </div>

                <div
                  id="tab-panel-2"
                  role="tabpanel"
                  aria-labelledby="tab-2"
                  className={cn("transition-opacity duration-200", {
                    "opacity-100": activeTab === "tab-2",
                    "opacity-0 hidden": activeTab !== "tab-2",
                  })}
                >
                  <div className="relative aspect-[4/5] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      className="object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20"
                      src="/basketball-player-marcus-thompson-action-shot.jpg"
                      alt="Player action shot"
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                  </div>
                </div>

                <div
                  id="tab-panel-3"
                  role="tabpanel"
                  aria-labelledby="tab-3"
                  className={cn("transition-opacity duration-200", {
                    "opacity-100": activeTab === "tab-3",
                    "opacity-0 hidden": activeTab !== "tab-3",
                  })}
                >
                  <div className="relative aspect-[4/5] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      className="object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20"
                      src="/basketball-player-portrait-action-shot.png"
                      alt="Player portrait"
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                  </div>
                </div>
                <div
                  id="tab-panel-4"
                  role="tabpanel"
                  aria-labelledby="tab-4"
                  className={cn("transition-opacity duration-200", {
                    "opacity-100": activeTab === "tab-4",
                    "opacity-0 hidden": activeTab !== "tab-4",
                  })}
                >
                  <div className="relative aspect-[4/5] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      className="object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20"
                      src="/basketball-player-portrait-action-shot.png"
                      alt="Player portrait"
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                  </div>
                </div>
              </div>
              {/* End Tab Content */}

              {/* SVG Element */}
              <div className="hidden absolute top-0 end-0 translate-x-20 md:block lg:translate-x-20"></div>
              {/* End SVG Element */}
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}

        {/* Background Color */}
        <div className="absolute inset-0 grid grid-cols-12 size-full">
          <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-gray-100 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full dark:bg-neutral-800"></div>
        </div>
        {/* End Background Color */}
      </div>
    </div>
  );
}
