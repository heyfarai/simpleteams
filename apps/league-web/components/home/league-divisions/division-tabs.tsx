"use client";

import { DivisionTab } from "./division-tab";
import type { Division, TabId } from "./division-data";

interface DivisionTabsProps {
  divisions: Division[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function DivisionTabs({ divisions, activeTab, onTabChange }: DivisionTabsProps) {
  return (
    <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 md:col-start-7 order-2 text-white">
      {/* Tab Navigation */}
      <nav
        className="grid gap-4 mt-5 md:mt-10"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="vertical"
      >
        {divisions.map((division) => (
          <DivisionTab
            key={division.id}
            division={division}
            isActive={activeTab === division.id}
            onClick={onTabChange}
          />
        ))}
      </nav>
    </div>
  );
}