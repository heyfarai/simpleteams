import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Play,
  Award,
  Handshake,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavoriteTeam } from "@/hooks/use-favorite-team";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam();
  const pathname = usePathname();

  const navItems = [
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/players", label: "Players", icon: Award },
    { href: "/games", label: "Games", icon: Calendar },
    { href: "/watch", label: "Watch", icon: Play },
  ];

  return (
    <header className="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-medium">
      <nav className="mt-10 relative max-w-6xl w-full bg-black/100 backdrop-blur-xl border border-white/20 rounded-full shadow shadow-black/90 flex flex-wrap md:flex-nowrap items-center justify-between p-0 ps-4 md:py-0 sm:mx-auto dark:bg-neutral-900/80 dark:border-neutral-700/20">
        <div className="container mx-auto pr-2">
          <div className="flex items-center justify-between ">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src="/nchh-logo.webp"
                  alt="National Capital Hoops Circuit Logo"
                  width={54}
                  height={54}
                  className=""
                />
              </div>
              <span
                className="hidden font-bold text-medium text-foreground"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                National Capital Hoops Circuit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 mr-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 transition-colors ${
                    pathname === item.href
                      ? "text-primary font-semibold"
                      : "text-white hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="hidden bg-primary hover:bg-primary/90 w-fit">
                Register
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button className="bg-primary hover:bg-primary/90 w-fit">
                    Join League
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
