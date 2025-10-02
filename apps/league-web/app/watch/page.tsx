import { MediaWatchSection } from "@/components/media-watch-section";

export default function WatchPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-48 text-center">
          <h1 className="pageTitle mt-16 lg:mt-24 text-6xl font-bold text-foreground mb-2 text-center">
            Watch
          </h1>
          <p className="text-muted-foreground">
            Relive the best moments from our basketball league
          </p>
        </div>
        <MediaWatchSection />
      </div>
    </main>
  );
}
