// ===========================
// TYPES & INTERFACES
// ===========================

export type PackageType = 'full-season' | 'two-session' | 'pay-per-session';

// Backend/Payment Configuration
export interface InstallmentConfig {
  enabled: boolean;
  installments: number;
  installmentPriceId: string;
  description?: string;
}

export interface PackageConfig {
  priceId: string;
  amount: number;
  name: string;
  description: string;
  installments?: InstallmentConfig;
}

// Frontend/UI Configuration
export interface PackageFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PackageOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  games: string;
  features: PackageFeature[];
  isRecommended?: boolean;
  description?: string;
  badge?: string;
}

// Package Comparison
export interface ComparisonRow {
  section?: string;
  type?: "header";
  label?: string;
  full?: string | boolean;
  two?: string | boolean;
  per?: string | boolean;
  highlight?: string;
  badges?: boolean;
}

// Early bird deadline
const EARLY_BIRD_DEADLINE = new Date('2025-09-24T23:59:59');

export const getPackageConfig = (): Record<PackageType, PackageConfig> => {
  const isEarlyBird = new Date() <= EARLY_BIRD_DEADLINE;

  return {
    "full-season": {
      priceId: isEarlyBird ? "price_1S9BXfIYuurzinGInwQywYOM" : "price_1S9BYNIYuurzinGIb7m1VWBK",
      amount: isEarlyBird ? 349500 : 379500, // $3,495 CAD early bird / $3,795 CAD regular
      name: `Full Season Team Registration${isEarlyBird ? ' (Early Bird)' : ''}`,
      description: "12+ games + playoffs - Pick any 3 season sessions × 4 games each",
      installments: {
        enabled: true,
        installments: 8,
        installmentPriceId: 'price_1SAdMiIYuurzinGII9aloGAw', // $437 CAD monthly
        description: '8 monthly payments'
      }
    },
    "two-session": {
      priceId: "price_1S9BYVIYuurzinGISFMHrpHB",
      amount: 179500, // $1,795.00 CAD
      name: "Two Session Pack Registration",
      description: "6 games max (3 per session)",
      installments: {
        enabled: true,
        installments: 4,
        installmentPriceId: 'price_TBD_4_MONTH', // To be created in Stripe
        description: '4 monthly payments'
      }
    },
    "pay-per-session": {
      priceId: "price_1S9BXkIYuurzinGIg6NX0B6n",
      amount: 89500, // $895.00 CAD
      name: "Pay Per Session Registration",
      description: "3 games max per session"
      // No installments for single session
    }
  };
};

export const getPackageInstallmentAmount = (packageType: PackageType): number => {
  const config = getPackageConfig()[packageType];
  if (!config.installments?.enabled) return 0;

  return Math.round(config.amount / config.installments.installments);
};

export const isInstallmentAvailable = (packageType: PackageType): boolean => {
  const config = getPackageConfig()[packageType];
  return config.installments?.enabled ?? false;
};

// ===========================
// CONSOLIDATED PACKAGE DATA
// ===========================

// Helper function to get current pricing based on early bird deadline
const getEarlyBirdPricing = () => {
  const isEarlyBird = new Date() <= EARLY_BIRD_DEADLINE;

  return {
    fullSeasonPrice: isEarlyBird ? 3495 : 3795,
    fullSeasonOriginalPrice: isEarlyBird ? 3795 : undefined,
    isEarlyBird,
  };
};

// Frontend UI Package Options (for package selection display)
export const getPackageOptions = (): PackageOption[] => {
  const { fullSeasonPrice, fullSeasonOriginalPrice, isEarlyBird } = getEarlyBirdPricing();

  return [
    {
      id: "full-season",
      name: "Full Season Team",
      price: fullSeasonPrice,
      originalPrice: fullSeasonOriginalPrice,
      games: "12 Games + Playoffs",
      isRecommended: true,
      badge: "Early Bird - Save $300",
      description: isEarlyBird
        ? "Early Bird Pricing - Save $300!"
        : "Pick any 3 season sessions × 4 games each",
      features: [
        {
          text: "Pick any 3 season sessions",
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
      games: "6 Games Max (3 per session)",
      description: "Registration deadline: Oct 5",
      features: [
        { text: "3 games max per session", included: true },
        { text: "Playoffs cost extra", included: false },
        { text: "Basic league benefits included", included: true },
      ],
    },
    {
      id: "pay-per-session",
      name: "Pay Per Session",
      price: 895,
      games: "3 Games Max per Session",
      description: "Various deadlines",
      features: [
        { text: "No priority scheduling or entry", included: false },
        { text: "Playoffs cost extra", included: false },
        { text: "Basic league benefits only", included: true },
      ],
    },
  ];
};

// Package Comparison Data
export const getComparisonRows = (): ComparisonRow[] => [
  // Cost & Games Section
  { section: "Cost & Games", type: "header" },
  {
    label: "Total Games",
    full: "12+ games",
    two: "6 games max",
    per: "3 games max",
    highlight: "full",
  },

  // Core Benefits Section
  { section: "Core Benefits", type: "header" },
  {
    label: "Pick any 3 season sessions × 4 games each",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Heavily discounted tournaments",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Playoff entry included",
    full: "Included",
    two: "Extra cost",
    per: "Extra cost",
  },

  // Additional rows (shown when expanded)
  {
    label: "Priority scheduling & entry",
    full: true,
    two: false,
    per: false,
  },
  { section: "Exclusive League Team Perks", type: "header" },
  {
    label: "50% off any in-season event",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Team roster banner provided",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "25% off regular door entry rates",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "20 FREE Swish Gold memberships",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Team preview video & write-up",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Discounted season stream pass",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "Player profiles for top performers",
    full: true,
    two: false,
    per: false,
  },
  {
    label: "15 vouchers ($5 off canteen/merch)",
    full: true,
    two: false,
    per: false,
  },
  { section: "Limitations", type: "header" },
  {
    label: "Games limited to 3 max per session",
    full: "No limit",
    two: "✓ Limited",
    per: "✓ Limited",
  },
  {
    label: "Higher cost per game",
    full: "Lowest",
    two: "Moderate",
    per: "Highest",
  },
  {
    label: "Additional perks available",
    full: "Full access",
    two: "Limited",
    per: "Basic only",
  },
];

// ===========================
// UNIFIED PACKAGE DETAILS (replaces duplicate utils)
// ===========================

export interface PackageDetails {
  name: string;
  amount: number;
  originalAmount?: number;
  description: string;
}

export function getPackageDetails(selectedPackage: string): PackageDetails {
  const config = getPackageConfig();
  const packageOption = getPackageOptions().find(pkg => pkg.id === selectedPackage);

  switch (selectedPackage) {
    case "full-season":
      return {
        name: config["full-season"].name,
        amount: Math.round(config["full-season"].amount / 100), // Convert cents to dollars
        originalAmount: packageOption?.originalPrice,
        description: config["full-season"].description,
      };
    case "two-session":
      return {
        name: config["two-session"].name,
        amount: Math.round(config["two-session"].amount / 100), // Convert cents to dollars
        description: config["two-session"].description,
      };
    case "pay-per-session":
      return {
        name: config["pay-per-session"].name,
        amount: Math.round(config["pay-per-session"].amount / 100), // Convert cents to dollars
        description: config["pay-per-session"].description,
      };
    default:
      return {
        name: "Registration Package",
        amount: 0,
        description: "Please select a package",
      };
  }
}

// For Stripe/email usage (formatted strings)
export interface PackageInfo {
  name: string;
  price: string;
  description: string;
}

export function getPackageInfo(packageId: string): PackageInfo {
  const details = getPackageDetails(packageId);
  return {
    name: details.name,
    price: `$${details.amount.toLocaleString()}`,
    description: details.description,
  };
}

// For UI components that need extended display properties
export interface PackageDisplayDetails {
  name: string;
  price: string;
  originalPrice?: string;
  games: string;
  badge?: string;
  description: string;
  isRecommended: boolean;
}

export function getPackageDisplayDetails(packageId: string): PackageDisplayDetails | null {
  const packageOption = getPackageOptions().find(pkg => pkg.id === packageId);
  if (!packageOption) return null;

  return {
    name: packageOption.name,
    price: `$${packageOption.price.toLocaleString()}`,
    originalPrice: packageOption.originalPrice ? `$${packageOption.originalPrice.toLocaleString()}` : undefined,
    games: packageOption.games,
    badge: packageOption.badge || (packageOption.isRecommended ? "🥇 BEST VALUE" : undefined),
    description: packageOption.description || "",
    isRecommended: packageOption.isRecommended || false,
  };
}