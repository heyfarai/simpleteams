import { GameDetails } from "@/components/game-details"

interface GamePageProps {
  params: {
    id: string
  }
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <main className="min-h-screen bg-background">
      <GameDetails gameId={params.id} />
    </main>
  )
}
