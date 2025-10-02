"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AutoVideoProps {
  src: string;
  className?: string;
}

export function AutoVideo({ src, className }: AutoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    const video = document.querySelector(`video[src="${src}"]`) as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <video
      src={src}
      className={cn("w-full h-full object-cover cursor-pointer", className)}
      autoPlay
      muted
      loop
      playsInline
      onClick={togglePlay}
    />
  );
}
