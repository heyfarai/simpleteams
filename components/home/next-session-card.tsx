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
    <Card className="border-0 shadow-none bg-none">
      <CardHeader>
        <CardTitle className="hidden md:text-2xl text-xl font-bold text-center">
          Game Time. <span className="font-light">Session #1</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-sm uppercase ">
          <span className="font-medium text-gray-400">YOUR MOMENT ARRIVES IN</span>
          {/* Countdown Timer */}
          <div className="flex flex-row gap-1 items-center justify-center text-center">
            {Object.entries(timeLeft)
              .slice(0, 4)
              .map(([unit, value]) => (
                <div
                  key={unit}
                  className=" rounded-lg p-2 text-center"
                >
                  <div className="lg:text-4xl text-2xl font-bold ">{value}</div>
                  <div className="lg:text-sm text-xs capitalize">{unit}</div>
                </div>
              ))}
          </div>
        </div>
        {/* Game Details */}
        <div className="flex justify-center">
          <Link
            href="/register"
            className="whitespace-nowrap py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-transparent bg-primary text-white hover:bg-gray-900 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
          >
            Register your Team
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
