"use client";

import { DivisionVideoPanel } from "./division-video-panel";
import type { Division, TabId } from "./division-data";

interface DivisionVideosProps {
  divisions: Division[];
  activeTab: TabId;
  playingStates: Record<TabId, boolean>;
  onVideoClick: (tabId: TabId, event: React.MouseEvent<HTMLVideoElement>) => void;
  onVideoRef: (tabId: TabId, element: HTMLVideoElement | null) => void;
}

export function DivisionVideos({
  divisions,
  activeTab,
  playingStates,
  onVideoClick,
  onVideoRef,
}: DivisionVideosProps) {
  return (
    <div className="lg:col-span-7 order-1 lg:order-2">
      <div className="relative">
        {/* Tab Content */}
        <div>
          {divisions.map((division) => (
            <DivisionVideoPanel
              key={division.id}
              division={division}
              isActive={activeTab === division.id}
              isPlaying={playingStates[division.id]}
              onVideoClick={onVideoClick}
              onVideoRef={onVideoRef}
            />
          ))}
        </div>

        {/* SVG Element */}
        <div className="absolute -top-20 end-0 translate-x-20 md:block lg:translate-x-20">
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
      </div>
    </div>
  );
}