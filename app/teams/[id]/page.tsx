import { TeamProfile } from "@/components/team-profile"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <TeamProfile teamId={params.id} />
    </main>
  )
}
