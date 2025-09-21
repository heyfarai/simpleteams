import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
  title: "Team Registration",
  description: "Register your basketball team for the National Capital Hoops Circuit. Choose from Full Season, Two Session Pack, or Pay Per Session registration packages. Join Ottawa's premier basketball league today."
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}