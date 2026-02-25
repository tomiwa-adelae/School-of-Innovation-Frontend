"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { homeNavLinks } from "@/constants/nav-links";
import { MobileNavbar } from "./MobileNavbar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/store/useAuth";
import { UserDropdown } from "./UserDropdown";

export const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (slug: string) =>
    pathname === slug || pathname.startsWith(`${slug}/`);

  return (
    <header className="fixed shadow bg-background top-0 z-50 w-full overflow-hidden border-b border-white/10">
      {/* <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent pointer-events-none" /> */}

      <div className="container h-20 flex items-center justify-between">
        <Link href={"/"} className="flex items-center">
          <Logo type="white" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 font-medium text-muted-foreground text-sm">
          {homeNavLinks.map(({ slug, label }, index) => (
            <Button
              size={"sm"}
              key={index}
              asChild
              className={isActive(slug) ? "text-primary" : ""}
              variant={isActive(slug) ? "secondary" : "ghost"}
            >
              <Link
                href={slug}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild size="md">
                <Link href="/courses">View Courses</Link>
              </Button>
            </>
          )}
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};
