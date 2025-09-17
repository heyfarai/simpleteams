"use client";

import { useEffect, useState, useRef } from 'react';

export function useSticky() {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is not intersecting and its bounding rect top is <= 0,
        // it means the element is sticky
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top <= 0);
      },
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isSticky };
}