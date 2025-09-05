import { SeasonDetail } from "@/components/season-detail"

export default function SeasonDetailPage({ params }: { params: { id: string } }) {
  return <SeasonDetail seasonId={params.id} />
}
