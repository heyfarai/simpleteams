import { Suspense } from "react";
import { GamesList } from "@/components/games/games-list";
import { GamesLoading } from "@/components/games/games-loading";
import { fetchFilterData } from "@/lib/data/fetch-filters";

export const metadata = {
  title: "Game Schedules | National Capital Hoops Circuit",
  description: "View all games and tournaments",
};

export default async function GamesPage() {
  const filterData = await fetchFilterData();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-16 md:mt-24 text-center">
          <div className="heading-highlight-container">
            <h1 className="display-heading heading-highlight">
              Game Schedules
            </h1>
          </div>
          <p className="text-muted-foreground">
            Stay up to date with all games and tournaments
          </p>
        </div>
        <Suspense fallback={<GamesLoading />}>
          <GamesList filterData={filterData} />
        </Suspense>
      </div>
    </main>
  );
}
