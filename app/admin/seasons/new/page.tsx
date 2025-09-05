import { SeasonForm } from "@/components/season-form"

export default function NewSeasonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create New Season</h1>
          <p className="text-muted-foreground">Set up a new basketball league season</p>
        </div>
        <SeasonForm />
      </div>
    </div>
  )
}
