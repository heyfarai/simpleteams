import { PlayersShowcase } from "@/components/players-showcase"

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Players Showcase</h1>
          <p className="text-muted-foreground">Discover the talented athletes in our league</p>
        </div>
        <PlayersShowcase />
      </div>
    </main>
  )
}
