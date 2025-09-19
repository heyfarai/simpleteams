"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface PackageOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  games: string;
  features: Array<{
    text: string;
    included: boolean;
    highlight?: boolean;
  }>;
  isRecommended?: boolean;
  description?: string;
  badge?: string;
}

interface PackageSelectionStepProps {
  selectedPackage: string;
  onPackageSelect: (packageId: string) => void;
  onNext?: () => void;
}

export function PackageSelectionStep({
  selectedPackage,
  onPackageSelect,
  onNext,
}: PackageSelectionStepProps) {
  const [showAllRows, setShowAllRows] = useState(false);

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId);

    // Auto-advance to next step after a short delay to show selection (only if onNext is provided)
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };
  const packages: PackageOption[] = [
    {
      id: "full-season",
      name: "Full Season Team",
      price: 3495,
      originalPrice: 3795,
      games: "12+ games + playoffs",
      isRecommended: true,
      badge: "🥇 BEST VALUE",
      description: "Pick any 3 season sessions × 4 games each",
      features: [
        {
          text: "Pick any 3 season sessions × 4 games each",
          included: true,
          highlight: true,
        },
        { text: "Heavily discounted tournaments", included: true },
        { text: "Playoff entry included", included: true },
        { text: "Priority scheduling & entry", included: true },
      ],
    },
    {
      id: "two-session",
      name: "Two Session Pack",
      price: 1795,
      games: "6 games max (3 per session)",
      description: "Registration deadline: Oct 5",
      features: [
        { text: "Can only play 3 games max per session", included: false },
        { text: "Playoffs cost extra", included: false },
        { text: "Limited additional perks", included: false },
        { text: "Basic league benefits included", included: true },
      ],
    },
    {
      id: "pay-per-session",
      name: "Pay Per Session",
      price: 895,
      games: "3 games max per session",
      description: "Individual sessions • Various deadlines",
      features: [
        { text: "No priority scheduling or entry", included: false },
        { text: "Playoffs cost extra", included: false },
        { text: "Higher cost per game (~$298)", included: false },
        { text: "Basic league benefits only", included: true },
      ],
    },
  ];

  // Define which rows to show initially (first 8 rows)
  const comparisonRows = [
    // Cost & Games Section (4 rows)
    { section: "Cost & Games", type: "header" },
    { label: "Total Games", full: "12+ games", two: "6 games max", per: "3 games max", highlight: "full" },
    { label: "Cost Per Game", full: "~$291", two: "~$299", per: "~$298", highlight: "full" },
    { label: "Package Value Rating", full: "BEST", two: "AVERAGE", per: "LOWEST", badges: true },

    // Core Benefits Section (4 rows)
    { section: "Core Benefits", type: "header" },
    { label: "Pick any 3 season sessions × 4 games each", full: true, two: false, per: false },
    { label: "Heavily discounted tournaments", full: true, two: false, per: false },
    { label: "Playoff entry included", full: "Included", two: "Extra cost", per: "Extra cost" },

    // Additional rows (shown when expanded)
    { label: "Priority scheduling & entry", full: true, two: false, per: false },
    { section: "Exclusive League Team Perks", type: "header" },
    { label: "50% off any in-season event", full: true, two: false, per: false },
    { label: "Team roster banner provided", full: true, two: false, per: false },
    { label: "25% off regular door entry rates", full: true, two: false, per: false },
    { label: "20 FREE Swish Gold memberships", full: true, two: false, per: false },
    { label: "Team preview video & write-up", full: true, two: false, per: false },
    { label: "Discounted season stream pass", full: true, two: false, per: false },
    { label: "Player profiles for top performers", full: true, two: false, per: false },
    { label: "15 vouchers ($5 off canteen/merch)", full: true, two: false, per: false },
    { section: "Limitations", type: "header" },
    { label: "Games limited to 3 max per session", full: "No limit", two: "✓ Limited", per: "✓ Limited" },
    { label: "Higher cost per game", full: "Lowest", two: "Moderate", per: "Highest" },
    { label: "Additional perks available", full: "Full access", two: "Limited", per: "Basic only" },
  ];

  const visibleRows = showAllRows ? comparisonRows : comparisonRows.slice(0, 8);

  const renderComparisonTable = () => (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-center mb-6">
          Complete Package Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left font-bold">Features & Benefits</th>
                <th className="px-3 py-3 text-center font-bold text-green-700">Full Season</th>
                <th className="px-3 py-3 text-center font-bold">Two Session</th>
                <th className="px-3 py-3 text-center font-bold">Pay Per Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleRows.map((row, index) => {
                if (row.type === "header") {
                  return (
                    <tr key={index} className="bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-700" colSpan={4}>
                        {row.section}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={index}>
                    <td className="px-3 py-2 font-medium">{row.label}</td>
                    <td className={`px-3 py-2 text-center ${row.highlight === "full" ? "text-green-600 font-bold" : ""}`}>
                      {row.badges && row.full === "BEST" ? (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">BEST</span>
                      ) : typeof row.full === "boolean" ? (
                        <span className={row.full ? "text-green-600" : "text-red-500"}>
                          {row.full ? "✓" : "✗"}
                        </span>
                      ) : (
                        row.full
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.badges && row.two === "AVERAGE" ? (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">AVERAGE</span>
                      ) : typeof row.two === "boolean" ? (
                        <span className={row.two ? "text-green-600" : "text-red-500"}>
                          {row.two ? "✓" : "✗"}
                        </span>
                      ) : (
                        row.two
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.badges && row.per === "LOWEST" ? (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">LOWEST</span>
                      ) : typeof row.per === "boolean" ? (
                        <span className={row.per ? "text-green-600" : "text-red-500"}>
                          {row.per ? "✓" : "✗"}
                        </span>
                      ) : (
                        row.per
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowAllRows(!showAllRows)}
            className="flex items-center gap-2"
          >
            {showAllRows ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More Features <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Package
        </h2>
        <p className="text-gray-600">
          Select the registration package that works best for your team
        </p>
      </div>

      {/* Comparison Table First */}
      {renderComparisonTable()}

      {/* Package Selection Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative"
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                pkg.isRecommended ? "mt-0" : ""
              } ${
                selectedPackage === pkg.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-xl hover:scale-105"
              } ${
                pkg.isRecommended ? "border-2 border-red-500 shadow-lg" : ""
              }`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  {pkg.isRecommended && (
                    <div className="hidden top-0 left-1/2 transform z-20 mb-2">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                        {pkg.badge}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold">
                      ${pkg.price.toLocaleString()}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${pkg.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.description}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-blue-600">
                    {pkg.games}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="flex items-center">
                          {feature.text.includes("cost extra") ||
                          feature.text.includes("No priority") ||
                          feature.text.includes("Higher cost") ? (
                            <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.highlight
                            ? "font-semibold"
                            : feature.included
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
