"use client";

import { useState } from "react";
import { GamesTable } from "@/components/front-office/games-table";
import { GameForm } from "@/components/front-office/game-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Game } from "@/lib/domain/models";

export default function GamesAdminPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleGameUpdated = (updatedGame: Game) => {
    setSelectedGame(updatedGame);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedGame(null);
    setIsCreatingNew(true);
  };

  const handleGameCreated = (newGame: Game) => {
    setSelectedGame(newGame);
    setIsCreatingNew(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 ">
        <div>
          <h1 className="text-2xl font-bold">Games Management</h1>
        </div>
      </div>

      {/* Main Content - 2 Pane Layout */}
      <div className="flex-1 flex mt-6 overflow-hidden">
        {/* Left Pane - Games Table */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="bg-white border rounded-tl-lg rounded-bl-lg overflow-hidden flex-1">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">All Games</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <GamesTable
                onGameSelect={setSelectedGame}
                selectedGameId={selectedGame?.id}
              />
            </div>
          </div>
        </div>

        {/* Right Pane - Game Edit Form */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="bg-white border border-l-0 rounded-tr-lg rounded-br-lg overflow-hidden flex-1">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {isCreatingNew ? "Create New Game" : selectedGame ? "Edit Game" : "Select a Game"}
              </h2>
              <Button
                size="sm"
                onClick={handleCreateNew}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <GameForm
                game={selectedGame}
                isCreatingNew={isCreatingNew}
                onGameUpdated={handleGameUpdated}
                onGameCreated={handleGameCreated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
