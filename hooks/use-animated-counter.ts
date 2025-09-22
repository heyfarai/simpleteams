import { useEffect, useRef } from "react";
import { useCountingAnimation } from "./use-counting-animation";

interface UseAnimatedCounterOptions {
  end: number;
  start?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
}

export function useAnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  threshold = 0.3,
  rootMargin = "0px",
}: UseAnimatedCounterOptions) {
  const elementRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);

  const { count, startAnimation } = useCountingAnimation({
    start,
    end,
    duration,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startAnimation();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [startAnimation, threshold, rootMargin]);

  return {
    count,
    ref: elementRef,
  };
}