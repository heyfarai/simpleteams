import type { PackageOption } from "../types";

// Helper function to get current pricing based on early bird deadline
const getEarlyBirdPricing = () => {
  const earlyBirdDeadline = new Date('2025-09-24T23:59:59');
  const isEarlyBird = new Date() <= earlyBirdDeadline;

  return {
    fullSeasonPrice: isEarlyBird ? 3495 : 3795,
    fullSeasonOriginalPrice: isEarlyBird ? 3795 : undefined,
    isEarlyBird
  };
};

export const packages: PackageOption[] = (() => {
  const { fullSeasonPrice, fullSeasonOriginalPrice, isEarlyBird } = getEarlyBirdPricing();

  return [
    {
      id: "full-season",
      name: "Full Season Team",
      price: fullSeasonPrice,
      originalPrice: fullSeasonOriginalPrice,
      games: "12+ games + playoffs",
      isRecommended: true,
      badge: "🥇 BEST VALUE",
      description: isEarlyBird ? "Early Bird Pricing - Save $300!" : "Pick any 3 season sessions × 4 games each",
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
})();