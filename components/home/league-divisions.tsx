"use client";

import { useState, useRef } from "react";
import { Trophy, Users2, CalendarDays, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type TabId = "tab-1" | "tab-2" | "tab-3" | "tab-4";

const clips = [
  {
    id: "tab-1",
    image: "/clips/clip-1.mp4",
    alt: "Game action shot",
  },
  {
    id: "tab-2",
    image: "/clips/clip-2.mp4",
    alt: "Player action shot",
  },
  {
    id: "tab-3",
    image: "/clips/clip-3.mp4",
    alt: "Player portrait",
  },
  {
    id: "tab-4",
    image: "/clips/clip-4.mp4",
    alt: "Player portrait",
  },
];

export function LeagueDivisions() {
  const [activeTab, setActiveTab] = useState<TabId>("tab-1");
  const videoRefs = useRef<Record<TabId, HTMLVideoElement | null>>({
    "tab-1": null,
    "tab-2": null,
    "tab-3": null,
    "tab-4": null,
  });
  const [playingStates, setPlayingStates] = useState({
    "tab-1": true,
    "tab-2": true,
    "tab-3": true,
    "tab-4": true,
  });

  const handleTabChange = (tabId: TabId) => {
    // Pause all videos except the one in the active tab
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && id !== tabId) {
        video.pause();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
      }
    });
    setActiveTab(tabId);
  };

  const handleVideoClick = (
    tabId: TabId,
    event: React.MouseEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
      setPlayingStates((prev) => ({ ...prev, [tabId]: true }));
    } else {
      video.pause();
      setPlayingStates((prev) => ({ ...prev, [tabId]: false }));
    }
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="relative p-6 md:p-16 ">
        {/* Grid */}
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-6 order-1 lg:order-2">
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
                  <div className="relative aspect-[9/16] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl group">
                    <video
                      className="w-full h-full object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20 cursor-pointer"
                      autoPlay
                      loop
                      playsInline
                      muted
                      controls={false}
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current["tab-1"] = el;
                      }}
                      onClick={(e) => handleVideoClick("tab-1", e)}
                    >
                      <source
                        src="/clips/clip1.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {playingStates["tab-1"] ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </div>
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
                  <div className="relative aspect-[9/16] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl group">
                    <video
                      className="w-full h-full object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20 cursor-pointer"
                      autoPlay
                      loop
                      playsInline
                      muted
                      controls={false}
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current["tab-2"] = el;
                      }}
                      onClick={(e) => handleVideoClick("tab-2", e)}
                    >
                      <source
                        src="/clips/clip2.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {playingStates["tab-2"] ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </div>
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
                  <div className="relative aspect-[9/16] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl group">
                    <video
                      className="w-full h-full object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20 cursor-pointer"
                      autoPlay
                      loop
                      playsInline
                      muted
                      controls={false}
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current["tab-3"] = el;
                      }}
                      onClick={(e) => handleVideoClick("tab-3", e)}
                    >
                      <source
                        src="/clips/clip3.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {playingStates["tab-3"] ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </div>
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
                  <div className="relative aspect-[9/16] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl group">
                    <video
                      className="w-full h-full object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20 cursor-pointer"
                      autoPlay
                      loop
                      playsInline
                      muted
                      controls={false}
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current["tab-4"] = el;
                      }}
                      onClick={(e) => handleVideoClick("tab-4", e)}
                    >
                      <source
                        src="/clips/clip4.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {playingStates["tab-4"] ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* End Tab Content */}

              {/* SVG Element */}
              <div className=" absolute -top-20 end-0 translate-x-20 md:block lg:translate-x-20">
                <svg
                  className="w-16 h-auto text-orange-500"
                  width="121"
                  height="135"
                  viewBox="0 0 121 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* End SVG Element */}
            </div>
          </div>
          <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 md:col-start-7 order-2  text-white">
            <h2 className=" text-5xl font-black text-white sm:text-3xl mt-8 md:mt-0">
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
                onClick={() => handleTabChange("tab-1")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-1" &&
                    "bg-white text-black shadow-md dark:bg-neutral-800"
                )}
                id="tab-1"
                role="tab"
                aria-selected={activeTab === "tab-1"}
                aria-controls="tab-panel-1"
              >
                <span className="flex gap-x-6">
                  <Trophy className="h-5 w-5 mt-0.5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold ">
                      Diamond Division
                    </span>
                    <div className=" mt-1 text-sm  grid grid-cols-2">
                      <div>U19/Mens</div>
                      <div>Grade 12 AAA+</div>
                      <div>Senior Prep</div>
                      <div>CEGEP D1</div>
                    </div>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("tab-2")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-2" &&
                    "bg-white text-black shadow-md dark:bg-neutral-800"
                )}
                id="tab-2"
                role="tab"
                aria-selected={activeTab === "tab-2"}
                aria-controls="tab-panel-2"
              >
                <span className="flex gap-x-6">
                  <Users2 className="h-5 w-5 mt-0.5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold ">
                      Premier Division
                    </span>
                    <div className=" mt-1 text-sm  grid grid-cols-2">
                      <div>U17-U18</div>
                      <div>Grade 11</div>
                      <div>Grade 12 AA</div>
                      <div>Junior Prep</div>
                      <div>CEGEP D2</div>
                    </div>
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("tab-3")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-950/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-3" &&
                    "bg-white text-black shadow-md dark:bg-neutral-800 border-2 border-primary"
                )}
                id="tab-3"
                role="tab"
                aria-selected={activeTab === "tab-3"}
                aria-controls="tab-panel-3"
              >
                <span className="flex gap-x-6">
                  <CalendarDays className="h-5 w-5 mt-0.5" />
                  <span className="grow">
                    <span className="block text-lg font-semibold ">
                      Supreme Division
                    </span>
                    <div className=" mt-1 text-sm  grid grid-cols-2">
                      <div>U16 AAA</div>
                      <div>Grade 10+</div>
                      <div>Junior Prep</div>
                      <div>Juvenile Gars</div>
                    </div>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("tab-4")}
                className={cn(
                  "text-start p-4 md:p-5 rounded-xl transition-all",
                  "hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-950/20",
                  "dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                  activeTab === "tab-4" &&
                    "bg-white text-black shadow-md dark:bg-neutral-800"
                )}
                id="tab-4"
                role="tab"
                aria-selected={activeTab === "tab-4"}
                aria-controls="tab-panel-4"
              >
                <span className="flex gap-x-6">
                  <CalendarDays className="mt-0.5 h-5 w-5" />
                  <span className="grow ">
                    <span className="flex flex-row items-center mb-3  font-semibold ">
                      Ascent Division
                      <Badge className="ml-2">New</Badge>
                    </span>
                    <div className=" mt-1 text-sm  grid grid-cols-2">
                      <div>U15 AAA</div>
                      <div>U16 AA</div>
                      <div>Grade 9+</div>
                      <div>Cadet Gars</div>
                    </div>
                  </span>
                </span>
              </button>
            </nav>
            {/* End Tab Navs */}
          </div>
          {/* End Col */}

          {/* End Col */}
        </div>
        {/* End Grid */}

        {/* Background Color */}
        <div className="absolute inset-0 grid grid-cols-12 size-full">
          <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-[#131211] w-full  rounded-xl lg:h-full dark:bg-neutral-800"></div>
        </div>
        {/* End Background Color */}
      </div>
    </div>
  );
}
