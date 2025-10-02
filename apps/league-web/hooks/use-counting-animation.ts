import { useState, useEffect, useRef } from "react";

interface UseCountingAnimationOptions {
  start?: number;
  end: number;
  duration?: number;
  easingFunction?: (t: number) => number;
}

export function useCountingAnimation({
  start = 0,
  end,
  duration = 2000,
  easingFunction = (t: number) => t * t * (3 - 2 * t), // smooth step easing
}: UseCountingAnimationOptions) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number>();
  const requestRef = useRef<number>();

  const startAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easingFunction(progress);
      const currentValue = start + (end - start) * easedProgress;

      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const resetAnimation = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setCount(start);
    setIsAnimating(false);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    count,
    isAnimating,
    startAnimation,
    resetAnimation,
  };
}