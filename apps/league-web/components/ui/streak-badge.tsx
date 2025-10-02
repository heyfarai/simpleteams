import { Check, X, Minus } from "lucide-react";

interface StreakBadgeProps {
  result: "W" | "L" | "T";
}

export function StreakBadge({ result }: StreakBadgeProps) {
  const bgColor =
    result === "W"
      ? "bg-green-500"
      : result === "L"
      ? "bg-red-500"
      : "bg-gray-500";
  const Icon = result === "W" ? Check : result === "L" ? X : Minus;

  return (
    <div
      className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <Icon className="h-3 w-3 text-white" />
    </div>
  );
}
