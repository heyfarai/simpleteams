import { Button } from "@/components/ui/button";
import { Grid3X3, BarChart3 } from "lucide-react";
import { ViewMode } from "@/lib/types/teams";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="team-view-mode-toggle flex items-center justify-end gap-2 -mt-4">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant={viewMode === "standings" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("standings")}
        className="gap-2"
      >
        <BarChart3 className="h-4 w-4" />
        Standings
      </Button>
    </div>
  );
}
