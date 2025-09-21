import { useMemo } from "react";
import { packages } from "@/components/registration/package-selection/data/packages";
import { comparisonRows } from "@/components/registration/package-selection/data/comparisonFeatures";
import type { PackageOption } from "@/components/registration/package-selection/types";

export function usePackageComparison() {
  const packageData = useMemo(() => packages, []);

  const comparisonData = useMemo(() => comparisonRows, []);

  const getPackageById = useMemo(() => {
    return (id: string): PackageOption | undefined => {
      return packageData.find(pkg => pkg.id === id);
    };
  }, [packageData]);

  const getVisibleComparisonRows = useMemo(() => {
    return (showAll: boolean, initialCount: number = 8) => {
      return showAll ? comparisonData : comparisonData.slice(0, initialCount);
    };
  }, [comparisonData]);

  const getPackageValue = useMemo(() => {
    return (packageId: string): { costPerGame: number; totalGames: number } => {
      const pkg = getPackageById(packageId);
      if (!pkg) return { costPerGame: 0, totalGames: 0 };

      const totalGames =
        packageId === "full-season" ? 12 :
        packageId === "two-session" ? 6 :
        packageId === "pay-per-session" ? 3 : 0;

      const costPerGame = totalGames > 0 ? pkg.price / totalGames : 0;

      return { costPerGame, totalGames };
    };
  }, [getPackageById]);

  return {
    packages: packageData,
    comparisonRows: comparisonData,
    getPackageById,
    getVisibleComparisonRows,
    getPackageValue,
  };
}