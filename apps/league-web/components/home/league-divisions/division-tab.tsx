"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Division, TabId } from "./division-data";

interface DivisionTabProps {
  division: Division;
  isActive: boolean;
  onClick: (tabId: TabId) => void;
}

export function DivisionTab({ division, isActive, onClick }: DivisionTabProps) {
  const Icon = division.icon;

  return (
    <div>
      <div
        className={cn(
          "p-0 py-2 md:p-5 rounded-xl transition-all",
          !isActive && "hover:bg-amber-950 dark:hover:bg-neutral-800",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-950/20 dark:focus-within:bg-neutral-800",
          isActive &&
            "md:bg-white md:text-black md:shadow-md md:dark:bg-neutral-800",
          division.id === "tab-3" && isActive && ""
        )}
      >
        <button
          type="button"
          onClick={() => onClick(division.id)}
          className="text-start w-full"
          id={division.id}
          role="tab"
          aria-selected={isActive}
          aria-controls={`tab-panel-${division.id}`}
        >
          <span className="flex gap-x-6">
            <Icon className="iconDivision hidden h-5 w-5 mt-0.5" />
            <span className="grow">
              {division.isNew ? (
                <h2 className="flex flex-row items-center mb-3 text-2xl font-bold tracking-wide">
                  {division.name}
                  <Badge className="ml-2 bg-amber-200 text-amber-950">
                    New
                  </Badge>
                </h2>
              ) : (
                <h2 className="block text-2xl font-bold tracking-wide">
                  {division.name}
                </h2>
              )}
              <div className="mt-1 text-sm grid grid-cols-2">
                {division.categories.map((category, index) => (
                  <div key={index}>{category}</div>
                ))}
              </div>
            </span>
          </span>
        </button>

        {/* Desktop CTA - only show when active */}
        {isActive && (
          <div className="hidden md:block mt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full"
              >
                Register for {division.displayName}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
