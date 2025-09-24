// Package configuration with installment settings
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

export type PackageType = 'full-season' | 'two-session' | 'pay-per-session';

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