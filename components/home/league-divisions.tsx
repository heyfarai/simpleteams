"use client";

import { useState, useRef, useEffect } from "react";
import { divisions } from "./league-divisions/division-data";
import { DivisionTabs } from "./league-divisions/division-tabs";
import { DivisionVideos } from "./league-divisions/division-videos";
import { DivisionCTA } from "./league-divisions/division-cta";
import type { TabId } from "./league-divisions/division-data";

export function LeagueDivisions() {
  const [activeTab, setActiveTab] = useState<TabId>("tab-1");
  const videoRefs = useRef<Record<TabId, HTMLVideoElement | null>>({
    "tab-1": null,
    "tab-2": null,
    "tab-3": null,
    "tab-4": null,
  });

  // Set random tab on component mount
  useEffect(() => {
    const tabs: TabId[] = ["tab-1", "tab-2", "tab-3", "tab-4"];
    const randomTab = tabs[Math.floor(Math.random() * tabs.length)];
    setActiveTab(randomTab);
  }, []);

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

  const handleVideoRef = (tabId: TabId, element: HTMLVideoElement | null) => {
    videoRefs.current[tabId] = element;
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-24">
      <div className="text-center mb-24 space-y-4">
        <div className="heading-highlight-container">
          <h1 className="display-heading heading-highlight px-4">
            Find Your Level.
          </h1>
        </div>
        <h2 className="text-xl font-medium md:text-2xl mt-4 leading-7">
          4 Divisions. A Journey for Every Player.
        </h2>
      </div>
      <div className="relative p-6 md:p-16 mb-24">
        {/* Grid */}
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <DivisionVideos
            divisions={divisions}
            activeTab={activeTab}
            playingStates={playingStates}
            onVideoClick={handleVideoClick}
            onVideoRef={handleVideoRef}
          />
          <DivisionTabs
            divisions={divisions}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        {/* End Grid */}

        {/* Mobile CTA */}
        <DivisionCTA
          activeDivision={null}
          isMobile
        />

        {/* Background Color */}
        <div className="absolute inset-0 grid grid-cols-12 size-full">
          <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-[#131211] w-full rounded-xl lg:h-full dark:bg-neutral-800"></div>
        </div>
        {/* End Background Color */}
      </div>
    </div>
  );
}
