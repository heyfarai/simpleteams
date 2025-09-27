import { useMemo } from "react";
import { getPackageOptions, getComparisonRows } from "@/lib/config/packages";
import type { PackageOption } from "@/lib/config/packages";

export function usePackageComparison() {
  const packageData = useMemo(() => getPackageOptions(), []);

  const comparisonData = useMemo(() => getComparisonRows(), []);

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