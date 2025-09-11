import { Suspense } from "react";
import { GamesList } from "@/components/games/games-list";
import { GamesLoading } from "@/components/games/games-loading";
import { fetchFilterData } from "@/lib/data/fetch-filters";

export const metadata = {
  title: "Games | NCHC League",
  description: "View all league games and tournaments",
};

export default async function GamesPage() {
  const filterData = await fetchFilterData();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 md:mt-48 text-center">
          <h1 className="pageTitle md:mt-16 lg:mt-24 text-6xl font-bold text-foreground mb-2 text-center">
            Games
          </h1>
          <p className="text-muted-foreground">
            Stay up to date with all league games and tournaments
          </p>
        </div>
        <Suspense fallback={<GamesLoading />}>
          <GamesList filterData={filterData} />
        </Suspense>
      </div>
    </main>
  );
}
