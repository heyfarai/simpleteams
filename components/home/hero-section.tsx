"use client";

import Image from "next/image";
import { NextSessionCard } from "./next-session-card";

export function HeroSection() {
  return (
    <section className="relative max-h-[80vh] min-h-[600px] w-full overflow-hidden flex">
      <div className="relative flex-1 lg:w-2/3 p-4">
        {/* Hero Content */}
        <div className="absolute inset-0 z-40">
          <div className="contentContainer container mx-auto px-4 h-full flex flex-col md:flex-col items-center justify-between pb-16">
            <Image
              src="/img/hero-season-2.png"
              alt="Basketball Court"
              fill
              className="object-contain mt-8 p-6"
            />
            <div className="hidden text max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">
                National Capital Hoops Circuit
              </h1>
              <p className="text-lg md:text-xl mb-6 text-pretty opacity-90">
                Where champions will rise in the Capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
