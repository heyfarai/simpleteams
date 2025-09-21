// Components
export { ComparisonTable } from "./ComparisonTable";
export { PackageCard } from "./PackageCard";
export { PackageGrid } from "./PackageGrid";
export { PricingTable } from "./PricingTable";

// Data
export { packages } from "./data/packages";
export { comparisonRows } from "./data/comparisonFeatures";

// Hooks
export { usePackageComparison } from "@/hooks/use-package-comparison";

// Types
export type {
  PackageOption,
  PackageFeature,
  ComparisonRow,
  PackageSelectionStepProps,
} from "./types";