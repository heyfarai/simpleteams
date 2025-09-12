"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function NextSessionCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mock next game data

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date("2025-11-01T19:30:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-black/10">
      <CardHeader>
        <CardTitle className="md:text-2xl text-xl font-bold text-center">
          Season 2: <span className="font-light">Session #1</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 text-center">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div
              key={unit}
              className=" rounded-lg p-5 text-center"
            >
              <div className="lg:text-4xl text-2xl font-bold ">{value}</div>
              <div className="lg:text-sm text-xs capitalize">{unit}</div>
            </div>
          ))}
        </div>

        {/* Game Details */}
        <div className="justify-center w-full">
          <Link
            href="/register"
            className="w-full  whitespace-nowrap py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-transparent bg-primary text-white hover:bg-gray-900 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
          >
            Register for 2025-26 Season
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
