import { SessionDetail } from "@/components/session-detail"

interface SessionDetailPageProps {
  params: {
    id: string
  }
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <SessionDetail sessionId={params.id} />
    </div>
  )
}
