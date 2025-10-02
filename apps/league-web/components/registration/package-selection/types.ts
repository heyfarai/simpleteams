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

export interface PackageSelectionStepProps {
  selectedPackage: string;
  onPackageSelect: (packageId: string) => void;
  onNext?: () => void;
}