import { Sidebar } from "@/components/front-office/sidebar";

interface FrontOfficeLayoutProps {
  children: React.ReactNode;
}

export default function FrontOfficeLayout({
  children,
}: FrontOfficeLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
