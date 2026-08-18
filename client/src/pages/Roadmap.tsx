import { Sidebar } from "@/components/Sidebar";
import { useMemo, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { motion } from "framer-motion";
import { Rocket, Loader2, PlayCircle, Hammer, Clock, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRoadmapStatus, useSyncRoadmap } from "@/hooks/use-roadmap";
import {
  buildRoadmap,
  SECTIONS,
  ROADMAP_GOAL,
  ROADMAP_DAYS,
  ROADMAP_START,
  totalRuntime,
} from "@shared/roadmap";

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4">
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-tight text-foreground">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const plan = useMemo(() => buildRoadmap(), []);
  const { data: status, isLoading } = useRoadmapStatus();
  const sync = useSyncRoadmap();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const daysElapsed = Math.min(
    ROADMAP_DAYS,
    Math.max(0, differenceInCalendarDays(new Date(), new Date(`${ROADMAP_START}T00:00:00`)) + 1)
  );

  const totalTasks = plan.reduce((n, d) => n + d.tasks.length, 0);
  const synced = status?.syncedTasks ?? 0;
  const isSynced = synced >= totalTasks;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="app-main flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground">
                <Rocket className="h-8 w-8 text-primary" /> {ROADMAP_DAYS}-Day Web Dev
              </h1>
              <p className="mt-1 text-muted-foreground">
                {ROADMAP_GOAL.title} ·{" "}
                {format(new Date(`${plan[0].date}T00:00:00`), "d MMM yyyy")} →{" "}
                {format(new Date(`${plan[plan.length - 1].date}T00:00:00`), "d MMM yyyy")}
              </p>
            </div>

            <Button
              onClick={() => sync.mutate()}
              disabled={sync.isPending || isLoading}
              variant={isSynced ? "outline" : "default"}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              {sync.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSynced ? (
                <Check className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isSynced ? "Tasks up to date" : "Send tasks to Tasks"}
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Day {daysElapsed} of {ROADMAP_DAYS}
              </span>
              <span className="text-muted-foreground">
                {status?.completedTasks ?? 0} of {synced || totalTasks} tasks done
              </span>
            </div>
            <Progress value={(daysElapsed / ROADMAP_DAYS) * 100} className="h-2" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ROADMAP_GOAL.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat icon={PlayCircle} value={`${ROADMAP_DAYS}`} label="Lectures, one a day" />
            <Stat icon={Clock} value={totalRuntime()} label="Total runtime" />
            <Stat icon={Hammer} value={`${totalTasks}`} label="Tasks in the plan" />
          </div>

          {/* The course, section by section */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">The course</h2>
            <p className="text-sm text-muted-foreground">
              One lecture a day in order, and one task to build something with it. Tap a section to
              see its days.
            </p>

            <div className="space-y-3">
              {SECTIONS.map((section) => {
                const days = plan.filter(
                  (d) => d.day >= section.fromDay && d.day <= section.toDay
                );
                const isOpen = openSection === section.name;
                const isCurrent =
                  daysElapsed >= section.fromDay && daysElapsed <= section.toDay;

                return (
                  <div
                    key={section.name}
                    className={cn(
                      "overflow-hidden rounded-xl border bg-card transition-colors",
                      isCurrent ? "border-primary/40" : "border-border/60"
                    )}
                  >
                    <button
                      onClick={() => setOpenSection(isOpen ? null : section.name)}
                      className="tap-none flex w-full items-start justify-between gap-3 p-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">{section.name}</span>
                          {isCurrent && (
                            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] text-primary">
                              You are here
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {section.focus}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        Day {section.fromDay}–{section.toDay}
                      </Badge>
                    </button>

                    {isOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-border/40"
                      >
                        {days.map((d) => {
                          const done = d.date < today;
                          const isToday = d.date === today;
                          return (
                            <li
                              key={d.day}
                              className={cn(
                                "flex items-baseline gap-3 border-b border-border/30 px-4 py-3 last:border-0",
                                isToday && "bg-primary/5"
                              )}
                            >
                              <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
                                Day {d.day}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    "text-sm text-foreground",
                                    done && "text-muted-foreground"
                                  )}
                                >
                                  {d.lesson.title}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {format(new Date(`${d.date}T00:00:00`), "EEE d MMM")} ·{" "}
                                  {d.lesson.duration}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
