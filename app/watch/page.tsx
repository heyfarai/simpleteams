import { MediaWatchSection } from "@/components/media-watch-section"

export default function WatchPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Watch</h1>
          <p className="text-muted-foreground">Relive the best moments from our basketball league</p>
        </div>
        <MediaWatchSection />
      </div>
    </main>
  )
}
