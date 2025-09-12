"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { NextSessionCard } from "./next-session-card";

export function HeroSection() {
  return (
    <section className="relative max-h-[80vh] min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-black/80 to-black/10 flex">
      <div className="relative flex-1 lg:w-2/3">
        {/* Hero Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="contentContainer container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between pb-16">
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">
                National Capital Hoops Circuit
              </h1>
              <p className="text-lg md:text-xl mb-6 text-pretty opacity-90">
                Where champions will rise in the Capital.
              </p>
            </div>

            <NextSessionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
