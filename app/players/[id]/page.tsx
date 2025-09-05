import { PlayerProfile } from "@/components/player-profile"

interface PlayerPageProps {
  params: {
    id: string
  }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <PlayerProfile playerId={params.id} />
    </main>
  )
}
