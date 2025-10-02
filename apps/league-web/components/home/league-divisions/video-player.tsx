"use client";

import { Play, Pause } from "lucide-react";
import type { TabId } from "./division-data";

interface VideoPlayerProps {
  src: string;
  tabId: TabId;
  isActive: boolean;
  isPlaying: boolean;
  onVideoClick: (tabId: TabId, event: React.MouseEvent<HTMLVideoElement>) => void;
  onVideoRef: (tabId: TabId, element: HTMLVideoElement | null) => void;
}

export function VideoPlayer({
  src,
  tabId,
  isActive,
  isPlaying,
  onVideoClick,
  onVideoRef,
}: VideoPlayerProps) {
  return (
    <div className="relative aspect-[9/16] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl group">
      <video
        className="w-full h-full object-cover shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20 cursor-pointer"
        autoPlay
        loop
        playsInline
        muted
        controls={false}
        ref={(el: HTMLVideoElement | null) => onVideoRef(tabId, el)}
        onClick={(e) => onVideoClick(tabId, e)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isPlaying ? (
          <Pause className="w-12 h-12 text-white" />
        ) : (
          <Play className="w-12 h-12 text-white" />
        )}
      </div>
    </div>
  );
}