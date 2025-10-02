import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlayerFormHeaderProps {
  title: string;
  backPath: string;
  description: string;
}

export function PlayerFormHeader({
  title,
  backPath,
  description,
}: PlayerFormHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4">
        <Link href={backPath}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roster
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}