"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";

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
      price: 795,
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

      {/* Value Proposition Banner */}
      <div className="hidden bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-4 text-center text-white">
        <h3 className="text-lg font-bold mb-1">
          🏆 EXCLUSIVE LEAGUE TEAM PERKS INCLUDED
        </h3>
        <p className="text-sm">
          Teams who commit to full seasons get rewards other leagues can't match
        </p>
      </div>

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

      {/* Comprehensive Benefits Comparison Table */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-center mb-6">
            Complete Package Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left font-bold">
                    Features & Benefits
                  </th>
                  <th className="px-3 py-3 text-center font-bold text-green-700">
                    Full Season
                  </th>
                  <th className="px-3 py-3 text-center font-bold">
                    Two Session
                  </th>
                  <th className="px-3 py-3 text-center font-bold">
                    Pay Per Session
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Cost & Games Section */}
                <tr className="bg-gray-50">
                  <td
                    className="px-3 py-2 font-bold text-gray-700"
                    colSpan={4}
                  >
                    Cost & Games
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Total Games</td>
                  <td className="px-3 py-2 text-center text-green-600 font-bold">
                    12+ games
                  </td>
                  <td className="px-3 py-2 text-center">6 games max</td>
                  <td className="px-3 py-2 text-center">3 games max</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">Cost Per Game</td>
                  <td className="px-3 py-2 text-center text-green-600 font-bold">
                    ~$291
                  </td>
                  <td className="px-3 py-2 text-center">~$299</td>
                  <td className="px-3 py-2 text-center text-red-500">~$298</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Package Value Rating
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      BEST
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                      AVERAGE
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      LOWEST
                    </span>
                  </td>
                </tr>

                {/* Core Benefits Section */}
                <tr className="bg-gray-50">
                  <td
                    className="px-3 py-2 font-bold text-gray-700"
                    colSpan={4}
                  >
                    Core Benefits
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Pick any 3 season sessions × 4 games each
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Heavily discounted tournaments
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Playoff entry included
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">
                    ✓ Included
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    Extra cost
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    Extra cost
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Priority scheduling & entry
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>

                {/* Exclusive League Team Perks */}
                <tr className="bg-gray-50">
                  <td
                    className="px-3 py-2 font-bold text-gray-700"
                    colSpan={4}
                  >
                    Exclusive League Team Perks
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    50% off any in-season event
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Team roster banner provided
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    25% off regular door entry rates
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    20 FREE Swish Gold memberships
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Team preview video & write-up
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Discounted season stream pass
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Player profiles for top performers
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    15 vouchers ($5 off canteen/merch)
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">✓</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                  <td className="px-3 py-2 text-center text-red-500">✗</td>
                </tr>

                {/* Limitations Section */}
                <tr className="bg-gray-50">
                  <td
                    className="px-3 py-2 font-bold text-gray-700"
                    colSpan={4}
                  >
                    Limitations
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Games limited to 3 max per session
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">
                    No limit
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    ✓ Limited
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    ✓ Limited
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Higher cost per game
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">
                    Lowest
                  </td>
                  <td className="px-3 py-2 text-center text-yellow-600">
                    Moderate
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    Highest
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium">
                    Additional perks available
                  </td>
                  <td className="px-3 py-2 text-center text-green-600">
                    Full access
                  </td>
                  <td className="px-3 py-2 text-center text-yellow-600">
                    Limited
                  </td>
                  <td className="px-3 py-2 text-center text-red-500">
                    Basic only
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
