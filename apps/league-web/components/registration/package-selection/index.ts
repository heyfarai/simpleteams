// Components
export { ComparisonTable } from "./ComparisonTable";
export { PackageCard } from "./PackageCard";
export { PackageGrid } from "./PackageGrid";
export { PricingTable } from "./PricingTable";

// Data
export { getPackageOptions as packages } from "@/lib/config/packages";
export { getComparisonRows as comparisonRows } from "@/lib/config/packages";

// Hooks
export { usePackageComparison } from "@/hooks/use-package-comparison";

// Types
export type {
  PackageOption,
  PackageFeature,
  ComparisonRow,
} from "@/lib/config/packages";
export type {
  PackageSelectionStepProps,
} from "./types";