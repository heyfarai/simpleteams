import { GamesSchedule } from "@/components/games-schedule"

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Games & Schedule</h1>
          <p className="text-muted-foreground">Stay up to date with all league games and tournaments</p>
        </div>
        <GamesSchedule />
      </div>
    </main>
  )
}
