import { PartnersShowcase } from "@/components/partners-showcase";

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-18 mt-48 text-center">
          <h1 className="pageTitle mt-16 lg:mt-24 text-6xl font-bold text-foreground mb-2 text-center">
            Our Partners
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're proud to partner with these amazing organizations who support
            our basketball circuit and help make our community stronger.
          </p>
        </div>
        <PartnersShowcase />
      </div>
    </main>
  );
}
