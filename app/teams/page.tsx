import { TeamsDirectory } from "@/components/teams-directory";
export const metadata = {
  title: "Teams",
};
export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-48 text-center">
          <h1 className="pageTitle mt-16 lg:mt-24 font-black lg:text-8xl md:text-6xl text-5xl tracking-tighter text-foreground mb-2 text-center">
            Teams
          </h1>
        </div>
        <TeamsDirectory />
      </div>
    </main>
  );
}
