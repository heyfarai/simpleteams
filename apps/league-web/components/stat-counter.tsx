"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface StatCounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function StatCounter({ end, suffix = "", label, duration = 2000 }: StatCounterProps) {
  const { count, ref } = useAnimatedCounter({
    end,
    duration,
    threshold: 0.3,
  });

  const formatCount = (count: number) => {
    if (suffix === "K+") {
      if (count >= 10000) {
        return "10K+";
      } else if (count >= 1000) {
        return `${Math.floor(count / 1000)}K+`;
      }
      return `${count}`;
    }
    return `${count}${suffix}`;
  };

  return (
    <div className="text-center" ref={ref}>
      <div className="md:text-8xl text-6xl text-primary mb-0 font-extrabold mutant">
        {formatCount(count)}
      </div>
      <p className="text-sm text-gray-600 uppercase font-bold">
        {label}
      </p>
    </div>
  );
}