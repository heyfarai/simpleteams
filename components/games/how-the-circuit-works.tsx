export function HowTheCircuitWorks() {
  return (
    <div className="max-w-4xl mx-auto my-12">
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="text-5xl mutant-outline text-primary mb-2 ">12</div>
          <h3 className="text-xl font-semibold mb-2 grotesk">Games Total</h3>
          <p className="text-sm text-muted-foreground">
            Each team plays exactly 12 games to complete their regular season
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="text-5xl mutant-outline text-primary mb-2 ">5</div>
          <h3 className="text-xl font-semibold mb-2 grotesk">
            Monthly Sessions
          </h3>
          <p className="text-sm text-muted-foreground">
            Sessions run monthly from November to March, plus Championship
            Weekend
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="text-5xl font-extrabold text-primary mb-2 grotesk">
            🏆
          </div>
          <h3 className="text-xl font-semibold mb-2 grotesk">Playoffs</h3>
          <p className="text-sm text-muted-foreground">
            Top teams from each session advance to Championship Weekend
          </p>
        </div>
      </div>
    </div>
  );
}
