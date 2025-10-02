"use client";

import { cn } from "@/lib/utils";
import { VideoPlayer } from "./video-player";
import type { Division, TabId } from "./division-data";

interface DivisionVideoPanelProps {
  division: Division;
  isActive: boolean;
  isPlaying: boolean;
  onVideoClick: (tabId: TabId, event: React.MouseEvent<HTMLVideoElement>) => void;
  onVideoRef: (tabId: TabId, element: HTMLVideoElement | null) => void;
}

export function DivisionVideoPanel({
  division,
  isActive,
  isPlaying,
  onVideoClick,
  onVideoRef,
}: DivisionVideoPanelProps) {
  return (
    <div
      id={`tab-panel-${division.id}`}
      role="tabpanel"
      aria-labelledby={division.id}
      className={cn("transition-opacity duration-200", {
        "opacity-100": isActive,
        "opacity-0 hidden": !isActive,
      })}
    >
      <VideoPlayer
        src={division.videoSrc}
        tabId={division.id}
        isActive={isActive}
        isPlaying={isPlaying}
        onVideoClick={onVideoClick}
        onVideoRef={onVideoRef}
      />
    </div>
  );
}