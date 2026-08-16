import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BookOpen, Target, CheckSquare, Rocket, Plus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav, TABS, useActiveTab } from "@/components/MobileNav";

const NAV = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/diary", label: "Entries", icon: BookOpen },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/todos", label: "Tasks", icon: CheckSquare },
  { href: "/roadmap", label: "Roadmap", icon: Rocket },
];

/**
 * App chrome. Desktop keeps the full sidebar; mobile gets a compact app bar
 * plus the bottom tab bar, which is what makes it read as an app rather than
 * a website in a phone-sized window.
 */
export function Sidebar() {
  const [location] = useLocation();
  const activeTab = useActiveTab();
  const title = TABS.find((t) => t.href === activeTab)?.label ?? "Bansi.R";

  return (
    <>
      {/* Mobile app bar */}
      <header className="mobile-appbar md:hidden">
        <span className="font-serif text-[17px] font-bold text-foreground">{title}</span>
        <Link href="/diary/new">
          <span className="tap-none flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 active:scale-95 transition-transform">
            <Plus className="h-5 w-5" />
          </span>
        </Link>
      </header>

      <MobileNav />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Bansi.R</h1>
          <p className="mt-1 text-xs tracking-widest text-muted-foreground">ACHIEVE MORE</p>
        </div>

        <div className="mb-8 px-4">
          <Link href="/diary/new">
            <Button className="w-full gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl">
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {NAV.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
