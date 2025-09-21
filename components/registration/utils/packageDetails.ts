export interface PackageDetails {
  name: string;
  amount: number;
  originalAmount?: number;
  description: string;
}

export function getPackageDetails(selectedPackage: string): PackageDetails {
  switch (selectedPackage) {
    case "full-season":
      return {
        name: "Full Season Team Registration",
        amount: 3495,
        originalAmount: 3795,
        description: "Complete season registration with all benefits",
      };
    case "two-session":
      return {
        name: "Two Session Pack Registration",
        amount: 1795,
        description: "Registration for two session blocks",
      };
    case "pay-per-session":
      return {
        name: "Pay Per Session Registration",
        amount: 895,
        description: "Flexible pay-as-you-go registration",
      };
    default:
      return {
        name: "Registration Package",
        amount: 0,
        description: "Please select a package",
      };
  }
}