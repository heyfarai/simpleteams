import { StatLeaderCard } from "./stat-leader-card";
import type { Player, StatCategory } from "@/lib/domain/models";

interface StatLeaderColumnProps {
  title: string;
  leaders: Player[];
  category: StatCategory;
  isLoading?: boolean;
}

export function StatLeaderColumn({
  title,
  leaders,
  category,
  isLoading,
}: StatLeaderColumnProps) {
  const getStatValue = (player: Player, category: StatCategory): number => {
    switch (category) {
      case "ppg":
        return player.stats.ppg;
      case "rpg":
        return player.stats.rpg;
      case "apg":
        return player.stats.apg;
      case "spg":
        return player.stats.spg;
      case "bpg":
        return player.stats.bpg;
      case "mpg":
        return player.stats.mpg;
      default:
        return 0;
    }
  };

  const getStatLabel = (category: StatCategory): string => {
    switch (category) {
      case "ppg":
        return "PPG";
      case "rpg":
        return "RPG";
      case "apg":
        return "APG";
      case "spg":
        return "SPG";
      case "bpg":
        return "BPG";
      case "mpg":
        return "MPG";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      {leaders.slice(0, 5).map((player, index) => (
        <StatLeaderCard
          key={player.id}
          player={player}
          rank={index + 1}
          statValue={getStatValue(player, category)}
          statLabel={getStatLabel(category)}
        />
      ))}
    </div>
  );
}