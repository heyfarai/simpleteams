import { TeamProfile } from "@/components/team-profile"

interface TeamPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <TeamProfile teamId={id} />
    </main>
  )
}
