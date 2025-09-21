import type { ComparisonRow } from "../types";

export const comparisonRows: ComparisonRow[] = [
  // Cost & Games Section (4 rows)
  { section: "Cost & Games", type: "header" },
  {
    label: "Total Games",
    full: "12+ games",
    two: "6 games max",
    per: "3 games max",
    highlight: "full",
  },
  // {
  //   label: "Cost Per Game",
  //   full: "~$291",
  //   two: "~$299",
  //   per: "~$298",
  //   highlight: "full"
  // },
  // {
  //   label: "Package Value Rating",
  //   full: "BEST",
  //   two: "AVERAGE",
  //   per: "LOWEST",
  //   badges: true
  // },

  // Core Benefits Section (4 rows)
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
