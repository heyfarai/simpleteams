"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Glide from "@glidejs/glide";

interface SlidesCarouselProps {
  slides: string[];
  title?: string;
}

export function SlidesCarousel({ slides, title = "Season Details" }: SlidesCarouselProps) {
  const glideRef = useRef<HTMLDivElement>(null);
  const glideInstanceRef = useRef<Glide | null>(null);

  useEffect(() => {
    if (glideRef.current && slides.length > 0) {
      // Initialize Glide
      glideInstanceRef.current = new Glide(glideRef.current, {
        type: "carousel",
        startAt: 0,
        perView: 1,
        gap: 20,
        autoplay: false,
        hoverpause: true,
        keyboard: true,
        animationDuration: 400,
        animationTimingFunc: "ease-out",
        breakpoints: {
          800: {
            perView: 1,
          },
        },
      });

      // Update slide counter on change
      glideInstanceRef.current.on('run', () => {
        const currentSlide = glideInstanceRef.current?.index || 0;
        const counterElement = document.querySelector('.glide-current-slide');
        if (counterElement) {
          counterElement.textContent = String(currentSlide + 1);
        }
      });

      glideInstanceRef.current.mount();

      return () => {
        if (glideInstanceRef.current) {
          glideInstanceRef.current.destroy();
        }
      };
    }
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="glide" ref={glideRef}>
        {/* Glide Track */}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {slides.map((slide, index) => (
              <li key={slide} className="glide__slide">
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={`/pdf/slides/${slide}`}
                    alt={`${title} - Slide ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority={index === 0}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Arrows */}
        <div className="glide__arrows" data-glide-el="controls">
          <button
            className="glide__arrow glide__arrow--left absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-primary transition-all duration-200 z-10"
            data-glide-dir="<"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="glide__arrow glide__arrow--right absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-primary transition-all duration-200 z-10"
            data-glide-dir=">"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Bullets */}
        <div className="glide__bullets flex justify-center mt-6 space-x-2" data-glide-el="controls[nav]">
          {slides.map((_, index) => (
            <button
              key={index}
              className="glide__bullet w-3 h-3 rounded-full bg-gray-300 hover:bg-primary transition-colors duration-200 data-[active]:bg-primary"
              data-glide-dir={`=${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          <span className="glide-current-slide">1</span> of {slides.length}
        </p>
      </div>
    </div>
  );
}