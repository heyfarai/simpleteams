import { PlayerProfile } from "@/components/player-profile"

interface PlayerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <PlayerProfile playerId={id} />
    </main>
  )
}
