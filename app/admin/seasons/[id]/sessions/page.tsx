import { SessionsList } from "@/components/sessions-list"

interface SessionsPageProps {
  params: {
    id: string
  }
}

export default function SessionsPage({ params }: SessionsPageProps) {
  return (
    <div className="container mx-auto py-6">
      <SessionsList seasonId={params.id} />
    </div>
  )
}
