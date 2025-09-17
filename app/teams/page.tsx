import { TeamsDirectory } from "@/components/teams-directory";
export const metadata = {
  title: "Teams",
};
export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-16 md:mt-24 text-center">
          <h1 className="display-heading">Teams</h1>
        </div>
        <TeamsDirectory />
      </div>
    </main>
  );
}
