import { Sidebar } from "@/components/Sidebar";
import { useMemo, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { motion } from "framer-motion";
import {
  Rocket,
  Loader2,
  Dumbbell,
  GraduationCap,
  Code2,
  RefreshCw,
  Check,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useRoadmapStatus, useSyncRoadmap } from "@/hooks/use-roadmap";
import {
  buildRoadmap,
  PHASES,
  WEEK,
  WEEK_PLANS,
  ROADMAP_GOAL,
  ROADMAP_DAYS,
  ROADMAP_START,
  to12h,
  type BlockKind,
} from "@shared/roadmap";

const KIND_STYLE: Record<BlockKind, string> = {
  health: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  college: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  collegework: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  lecture: "bg-primary/10 text-primary border-primary/20",
  build: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  dsa: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  ship: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  career: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

const KIND_LABEL: Record<BlockKind, string> = {
  health: "Exercise",
  college: "College",
  collegework: "College work",
  lecture: "Lecture",
  build: "Build",
  dsa: "DSA",
  ship: "Ship",
  career: "Career",
};

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Code2;
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

  const today = format(new Date(), "yyyy-MM-dd");
  const currentIndex = plan.findIndex((d) => d.date >= today);
  const [openDay, setOpenDay] = useState(currentIndex < 0 ? 0 : currentIndex);
  const selected = plan[Math.min(Math.max(openDay, 0), plan.length - 1)];

  const daysElapsed = Math.min(
    ROADMAP_DAYS,
    Math.max(0, differenceInCalendarDays(new Date(), new Date(`${ROADMAP_START}T00:00:00`)) + 1)
  );

  const totals = useMemo(() => {
    let coding = 0;
    let lectures = 0;
    for (const day of plan) {
      coding += day.codingHours;
      lectures += day.tasks.filter((t) => t.kind === "lecture").length;
    }
    return { coding, lectures, tasks: plan.reduce((n, d) => n + d.tasks.length, 0) };
  }, [plan]);

  const synced = status?.syncedTasks ?? 0;
  const isSynced = synced >= totals.tasks;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="app-main flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground">
                <Rocket className="h-8 w-8 text-primary" /> 100-Day Roadmap
              </h1>
              <p className="mt-1 text-muted-foreground">
                {ROADMAP_GOAL.title} · {format(new Date(`${plan[0].date}T00:00:00`), "d MMM yyyy")}{" "}
                → {format(new Date(`${plan[plan.length - 1].date}T00:00:00`), "d MMM yyyy")}
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
                {status?.completedTasks ?? 0} of {synced || totals.tasks} tasks done
              </span>
            </div>
            <Progress value={(daysElapsed / ROADMAP_DAYS) * 100} className="h-2" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ROADMAP_GOAL.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat icon={Code2} value={`${totals.coding} h`} label="Coding time booked" />
            <Stat icon={GraduationCap} value={`${totals.lectures}`} label="Cohort lecture blocks" />
            <Stat icon={Dumbbell} value="100 h" label="Exercise, 1 h a day" />
          </div>

          {/* The repeating week */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">The repeating week</h2>
            <p className="text-sm text-muted-foreground">
              Blocks are placed around the fixed college timetable and two hours of daily travel,
              so every slot below is time you are actually free. College work isn't tracked here —
              coding still beats class time by at least an hour every day.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="p-3 font-medium">Day</th>
                    <th className="p-3 font-medium">Work blocks</th>
                    <th className="p-3 font-medium text-right">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((i) => {
                    const d = WEEK[i];
                    const slots = d.blocks
                      .filter((b) => b.kind !== "college" && b.kind !== "collegework")
                      .map((b) => `${to12h(b.start)}–${to12h(b.end)}`)
                      .join(" · ");
                    return (
                      <tr key={d.weekday} className="border-b border-border/40 last:border-0">
                        <td className="p-3 font-medium text-foreground">{d.weekday}</td>
                        <td className="p-3 text-muted-foreground">{slots}</td>
                        <td className="p-3 text-right font-medium text-primary">
                          {d.codingHours} h
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Phases */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">Seven phases</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PHASES.map((phase) => {
                const active = daysElapsed >= phase.fromDay && daysElapsed <= phase.toDay;
                return (
                  <div
                    key={phase.name}
                    className={cn(
                      "rounded-xl border p-4 transition-colors",
                      active ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{phase.name}</p>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        Day {phase.fromDay}–{phase.toDay}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {phase.focus}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Week by week */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">Week by week</h2>
            <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-card px-4">
              {WEEK_PLANS.map((w) => (
                <AccordionItem key={w.week} value={`w${w.week}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 pr-3">
                      <Badge variant="outline" className="text-[10px]">
                        Week {w.week}
                      </Badge>
                      <span className="font-medium text-foreground">{w.theme}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5 text-sm">
                    <p className="flex items-start gap-2 text-foreground">
                      <Flag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-medium">Milestone:</span> {w.milestone}
                      </span>
                    </p>

                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Lectures
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {w.lectures.filter(Boolean).map((l) => (
                          <li key={l}>· {l}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Build
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {w.build.filter(Boolean).map((b) => (
                          <li key={b}>· {b}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Career
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {w.career.filter(Boolean).map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-muted-foreground">
                      <span className="text-xs font-medium uppercase tracking-wide">DSA</span> —{" "}
                      {w.dsa}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* A single day, in full */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold text-foreground">A day in full</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDay((d) => Math.max(0, d - 1))}
                  disabled={openDay <= 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDay((d) => Math.min(plan.length - 1, d + 1))}
                  disabled={openDay >= plan.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            <motion.div
              key={selected.date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 rounded-xl border border-border/60 bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-serif text-lg font-bold text-foreground">
                  Day {selected.day} · {selected.weekday}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(`${selected.date}T00:00:00`), "d MMMM yyyy")}
                </p>
                <Badge variant="outline" className="text-[10px]">
                  Week {selected.week}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selected.phase.name}</p>

              <div className="space-y-2 pt-2">
                {selected.tasks.map((t) => (
                  <div
                    key={t.title}
                    className="flex flex-wrap items-start gap-x-3 gap-y-1 rounded-lg border border-border/40 p-3"
                  >
                    <span className="w-[128px] shrink-0 font-mono text-xs text-muted-foreground">
                      {t.startLabel}–{t.endLabel}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("h-5 shrink-0 px-2 py-0 text-[10px] font-normal", KIND_STYLE[t.kind])}
                    >
                      {KIND_LABEL[t.kind]}
                    </Badge>
                    <span className="flex-1 text-sm text-foreground">
                      {/* Drop the time prefix and the kind word — both are shown already. */}
                      {t.title
                        .split(" · ")
                        .slice(1)
                        .join(" · ")
                        .replace(/^(Lecture|Build|Ship|Career|DSA) — /, "")}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
