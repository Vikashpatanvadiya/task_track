import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckSquare, Rocket, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bansi.onboarded.v1";

interface Slide {
  icon: LucideIcon;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: Rocket,
    title: "One goal at a time",
    body: "A paid internship in 100 days is the goal. Every task in here ladders up to it, so you always know why you are doing the thing in front of you.",
  },
  {
    icon: CheckSquare,
    title: "Your day, already planned",
    body: "Each morning opens to a short list with times on it — workout, lecture, build, DSA. Tick them off as you go. Add your own whenever something comes up.",
  },
  {
    icon: BookOpen,
    title: "Write it down",
    body: "Entries keep the record: what you shipped, what broke, how it felt. In three months it is the proof you can point an interviewer at.",
  },
];

export function Onboarding() {
  const [done, setDone] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return true; // storage blocked — never trap the user behind this
    }
  });
  const [index, setIndex] = useState(0);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDone(true);
  };

  if (done) return null;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex justify-end p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <button
          onClick={finish}
          className="tap-none rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <slide.icon className="h-9 w-9" strokeWidth={1.8} />
            </div>
            <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-foreground">
              {slide.title}
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6 px-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <span
              key={s.title}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
          onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
        >
          {isLast ? "Get started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
