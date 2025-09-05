import { DivisionDetail } from "@/components/division-detail"

export default function DivisionDetailPage({ params }: { params: { id: string } }) {
  return <DivisionDetail divisionId={params.id} />
}
