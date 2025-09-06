import { GamesSchedule } from "@/components/games-schedule";

export const metadata = {
  title: "Games",
};
export default function GamesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-48 text-center">
          <h1 className="pageTitle mt-16 lg:mt-24 text-6xl font-bold text-foreground mb-2 text-center">
            Games
          </h1>
          <p className="text-muted-foreground">
            Stay up to date with all league games and tournaments
          </p>
        </div>
        <GamesSchedule />
      </div>
    </main>
  );
}
