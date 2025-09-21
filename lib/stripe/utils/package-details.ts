export interface PackageInfo {
  name: string;
  price: string;
  description: string;
}

const packages = {
  "full-season": {
    name: "Full Season Team Registration",
    price: "$3,495",
    description: "12+ games + playoffs",
  },
  "two-session": {
    name: "Two Session Pack Registration",
    price: "$1,795",
    description: "6 games max (3 per session)",
  },
  "pay-per-session": {
    name: "Pay Per Session Registration",
    price: "$895",
    description: "3 games max per session",
  },
};

export function getPackageDetails(packageId: string): PackageInfo {
  return (
    packages[packageId as keyof typeof packages] || {
      name: "Team Registration",
      price: "TBD",
      description: "Basketball league registration",
    }
  );
}