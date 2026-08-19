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
  TRACKS,
  buildTrack,
  trackDays,
  totalRuntime,
  ROADMAP_START,
  type Track,
  type TrackId,
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

function TrackView({
  track,
  daysElapsed,
  today,
  completed,
}: {
  track: Track;
  daysElapsed: number;
  today: string;
  completed: number;
}) {
  const days = useMemo(() => buildTrack(track.id), [track.id]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const total = trackDays(track);
  const current = Math.min(total, daysElapsed);

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Day {current} of {total}
          </span>
          <span className="text-muted-foreground">{completed} tasks done</span>
        </div>
        <Progress value={(current / total) * 100} className="h-2" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {track.goalDescription}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(`${days[0].date}T00:00:00`), "d MMM yyyy")} →{" "}
          {format(new Date(`${days[days.length - 1].date}T00:00:00`), "d MMM yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat icon={PlayCircle} value={`${track.lessons.length}`} label="Lectures" />
        <Stat icon={Clock} value={totalRuntime(track)} label="Total runtime" />
        <Stat icon={Hammer} value={`${total}`} label="Days, watch then build" />
      </div>

      <div className="space-y-3">
        {track.sections.map((section) => {
          const sectionDays = days.filter(
            (d) => d.lessonNumber >= section.fromLesson && d.lessonNumber <= section.toLesson
          );
          const isOpen = openSection === section.name;
          const firstDay = sectionDays[0].day;
          const lastDay = sectionDays[sectionDays.length - 1].day;
          const isCurrent = current >= firstDay && current <= lastDay;

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
                      <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/5 text-[10px] text-primary"
                      >
                        You are here
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {section.focus}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  Day {firstDay}–{lastDay}
                </Badge>
              </button>

              {isOpen && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-border/40"
                >
                  {sectionDays.map((d) => {
                    const isToday = d.date === today;
                    const past = d.date < today;
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
                              past && "text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "mr-2 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
                                d.phase === "watch"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-amber-500/10 text-amber-600"
                              )}
                            >
                              {d.phase}
                            </span>
                            {d.lesson.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {format(new Date(`${d.date}T00:00:00`), "EEE d MMM")}
                            {d.phase === "watch" && ` · ${d.lesson.duration}`}
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
    </div>
  );
}

export default function Roadmap() {
  const { data: status, isLoading } = useRoadmapStatus();
  const sync = useSyncRoadmap();
  const [active, setActive] = useState<TrackId>(TRACKS[0].id);

  const today = format(new Date(), "yyyy-MM-dd");
  const daysElapsed = Math.max(
    0,
    differenceInCalendarDays(new Date(), new Date(`${ROADMAP_START}T00:00:00`)) + 1
  );

  const totalTasks = TRACKS.reduce((n, t) => n + trackDays(t), 0);
  const synced = status?.tracks.reduce((n, t) => n + t.syncedTasks, 0) ?? 0;
  const isSynced = synced >= totalTasks;
  const track = TRACKS.find((t) => t.id === active) ?? TRACKS[0];
  const trackStatus = status?.tracks.find((t) => t.trackId === active);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="app-main flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground">
                <Rocket className="h-8 w-8 text-primary" /> Roadmap
              </h1>
              <p className="mt-1 text-muted-foreground">
                Two courses in parallel from {format(new Date(`${ROADMAP_START}T00:00:00`), "d MMM yyyy")}
                . Watch a lecture, build with it the next day.
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

          {/* Track switcher */}
          <div className="flex gap-2 rounded-xl border border-border/60 bg-card p-1">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  "tap-none flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  t.id === active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.name}
              </button>
            ))}
          </div>

          <TrackView
            key={track.id}
            track={track}
            daysElapsed={daysElapsed}
            today={today}
            completed={trackStatus?.completedTasks ?? 0}
          />
        </div>
      </main>
    </div>
  );
}
