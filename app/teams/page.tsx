import { TeamsDirectory } from "@/components/teams-directory"

export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Teams Directory</h1>
          <p className="text-muted-foreground">Explore all teams competing in our league</p>
        </div>
        <TeamsDirectory />
      </div>
    </main>
  )
}
