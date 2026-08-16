import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, CheckSquare, Home, Rocket, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/diary", label: "Entries", icon: BookOpen },
  { href: "/todos", label: "Tasks", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/roadmap", label: "Roadmap", icon: Rocket },
] as const;

export function useActiveTab() {
  const [location] = useLocation();
  return (
    TABS.slice(1).find((t) => location.startsWith(t.href))?.href ??
    (location === "/" ? "/" : null)
  );
}

/** Native-style bottom tab bar. Mobile only — desktop keeps the sidebar. */
export function MobileNav() {
  const active = useActiveTab();

  return (
    <nav className="mobile-tabbar md:hidden" aria-label="Main">
      {TABS.map((tab) => {
        const isActive = active === tab.href;
        return (
          <Link key={tab.href} href={tab.href} className="flex-1">
            <span
              className={cn(
                "tap-none relative flex h-full flex-col items-center justify-center gap-1 pt-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tabbar-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-x-3 top-0 h-[3px] rounded-full bg-primary"
                />
              )}
              <tab.icon
                className={cn("h-[22px] w-[22px] transition-transform", isActive && "scale-110")}
                strokeWidth={isActive ? 2.4 : 1.9}
              />
              <span className={cn("text-[10px] leading-none", isActive && "font-semibold")}>
                {tab.label}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
