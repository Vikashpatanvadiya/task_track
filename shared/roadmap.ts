/**
 * 79-Day Web Dev Roadmap
 * ----------------------
 * One video a day, in order, plus one task to build something with what that
 * video taught. Nothing else — no timetable, no padding.
 *
 * Both the server (task sync) and the client (Roadmap page) import from here,
 * so the plan can only ever be defined once.
 */
import { calendarDay } from "./date";

export const ROADMAP_GOAL = {
  title: "Learn Web Dev",
  description:
    "Finish the web dev cohort in 79 days — one lecture a day, start to finish, " +
    "and something built with it before the day is out.",
} as const;

/** Day 1. */
export const ROADMAP_START = "2026-08-18";

export type Priority = "Low" | "Medium" | "High";
export type TaskKind = "watch" | "build";

export interface Lesson {
  title: string;
  /** Runtime, as listed in the course. */
  duration: string;
}

/** The course, in the order it is meant to be watched. One per day. */
export const LESSONS: Lesson[] = [
  { title: "Javascript Basics", duration: "1:55:29" },
  { title: "HTML Basics (Tags and Attributes)", duration: "33:47" },
  { title: "CSS Basics", duration: "59:41" },
  { title: "Async JS", duration: "2:27:35" },
  { title: "Promises", duration: "2:50:27" },
  { title: "Bash and Terminals (Basics)", duration: "34:34" },
  { title: "Bash Advance (Laisha)", duration: "56:05" },
  { title: "VS Code Assignment", duration: "34:26" },
  { title: "DOM (Simple)", duration: "2:22:47" },
  { title: "DOM (Advance)", duration: "2:20:09" },
  { title: "Node.js, Bun and JS runtimes", duration: "2:22:48" },
  { title: "HTTP Servers (Express)", duration: "2:30:22" },
  { title: "Express and HTTP server | Postman", duration: "1:18:44" },
  { title: "Headers, Query parameters", duration: "2:18:29" },
  { title: "Middlewares and cors", duration: "2:04:33" },
  { title: "Git and Github", duration: "1:26:44" },
  { title: "Map, Filter and Arrow fns", duration: "19:13" },
  { title: "Axios vs Fetch", duration: "21:42" },
  { title: "HTTP Deep dive and Auth in Node.js", duration: "2:44:54" },
  { title: "Auth and connecting FE to BE", duration: "2:24:30" },
  { title: "JWT and Auth Recap", duration: "40:16" },
  { title: "Mongo Installation", duration: "6:43" },
  { title: "MongoDB", duration: "2:07:43" },
  { title: "Passwords, zod", duration: "2:07:51" },
  { title: "Backend of Course selling app", duration: "2:14:29" },
  { title: "Backend of Course selling app (Part 2)", duration: "2:16:17" },
  { title: "Mongo Deep dive", duration: "2:09:56" },
  { title: "React Basics", duration: "2:02:45" },
  { title: "React useState", duration: "2:14:30" },
  { title: "React from basics Part-1", duration: "2:24:35" },
  { title: "React from basics Part-2", duration: "55:16" },
  { title: "React Part 2. (SPAs, routing)", duration: "1:56:05" },
  { title: "React Part 3 (Context API, Rolling up the state)", duration: "1:34:15" },
  { title: "Custom Hooks, useDebounce, useFetch", duration: "2:15:03" },
  { title: "State management using Recoil", duration: "2:21:48" },
  { title: "Recoil Deep dive", duration: "1:33:36" },
  { title: "Ui/Ux Primitives (Part 1)", duration: "2:29:01" },
  { title: "Ui/Ux Primitives (Part 2)", duration: "2:17:27" },
  { title: "Tailwind, ref arrays and building components", duration: "2:12:13" },
  { title: "Tailwind Part 2, Creating sidebars", duration: "2:03:56" },
  { title: "Typescript Part 1", duration: "2:24:14" },
  { title: "Types, Interfaces and implementing interfaces", duration: "2:31:13" },
  { title: "Typescript Advance APIs", duration: "41:54" },
  { title: "End to end app in typescript - building a second brain app", duration: "2:00:55" },
  { title: "Creating a UI Library, Button component", duration: "2:02:57" },
  { title: "Brainly end to end", duration: "3:21:33" },
  { title: "Websockets", duration: "2:04:18" },
  { title: "WebSockets Project - Chat app", duration: "2:10:41" },
  { title: "Postgres and SQL databases", duration: "2:29:55" },
  { title: "Postgres and SQL databases - Part 2", duration: "1:59:40" },
  { title: "Prisma and ORMs", duration: "2:01:58" },
  { title: "Starting NextJs, introducing SSR", duration: "2:01:38" },
  { title: "NextJS continuation", duration: "2:24:27" },
  { title: "Next.js Continued", duration: "2:16:09" },
  { title: "NextAuth", duration: "2:15:03" },
  { title: "Mono repos and turborepo", duration: "2:08:55" },
  { title: "Monorepos Continued (Better Quality)", duration: "2:03:25" },
  { title: "CSR vs SSR vs Static Site Generation", duration: "38:51" },
  { title: "Building PayTM Project", duration: "12:06:11" },
  { title: "PayTM Frontend", duration: "1:04:31" },
  { title: "End to End - Project #1 - Excalidraw", duration: "2:20:13" },
  { title: "Excalidraw Part-2", duration: "2:59:40" },
  { title: "Excalidraw Part-3", duration: "2:38:28" },
  { title: "Excalidraw Part-4", duration: "2:17:57" },
  { title: "Project class - Creating betterstack (Part 1)", duration: "2:08:22" },
  { title: "betterstack (Part 2)", duration: "3:05:04" },
  { title: "betterstack (Part 3)", duration: "1:58:09" },
  { title: "Async Backend Communication and Redis streams | betterstack (Part 4)", duration: "1:32:24" },
  { title: "Adding worker and Pusher using redis streams in Javascript", duration: "55:51" },
  { title: "Finishing the frontend", duration: "53:00" },
  { title: "Scaling HTTP Servers and WS Servers", duration: "1:51:10" },
  { title: "openAPI spec, Autogenerated clients, Rate Limiting, Captcha, ddos Protection", duration: "1:33:15" },
  { title: "Performance Benchmarks - Rust vs Go vs JavaScript", duration: "39:26" },
  { title: "Rate Limiting, DDoS and Captcha", duration: "1:40:01" },
  { title: "Deploy Anything with Coolify", duration: "22:53" },
  { title: "Building CodeForces", duration: "2:19:45" },
  { title: "Continuing the Codeforces Project", duration: "1:26:12" },
  { title: "Sharding, Replication and System Design", duration: "1:45:37" },
  { title: "Building Replit", duration: "3:22:41" },
];

export const ROADMAP_DAYS = LESSONS.length;

export interface Section {
  name: string;
  fromDay: number;
  toDay: number;
  focus: string;
}

export const SECTIONS: Section[] = [
  { name: "JavaScript & the Browser", fromDay: 1, toDay: 10, focus: "The language, the page, and the tools you drive them with." },
  { name: "Node, Express & Auth", fromDay: 11, toDay: 21, focus: "Leave the browser: servers, HTTP, middleware, and logging people in." },
  { name: "MongoDB & the Course App", fromDay: 22, toDay: 27, focus: "A real database behind a real backend." },
  { name: "React", fromDay: 28, toDay: 36, focus: "Components, state, routing, and state management that scales." },
  { name: "UI/UX & Tailwind", fromDay: 37, toDay: 40, focus: "Making it look like something you would ship." },
  { name: "TypeScript & Second Brain", fromDay: 41, toDay: 46, focus: "Types across the stack, then a full app built with them." },
  { name: "WebSockets & SQL", fromDay: 47, toDay: 51, focus: "Realtime, then relational databases and an ORM." },
  { name: "Next.js & Monorepos", fromDay: 52, toDay: 58, focus: "SSR, auth, and keeping several apps in one repo." },
  { name: "PayTM & Excalidraw", fromDay: 59, toDay: 64, focus: "The two big portfolio projects." },
  { name: "Betterstack", fromDay: 65, toDay: 70, focus: "An uptime monitor end to end, workers and all." },
  { name: "Scaling & System Design", fromDay: 71, toDay: 79, focus: "Load, limits, sharding — and Replit to finish." },
];

export interface RoadmapTask {
  kind: TaskKind;
  /** Title as stored on the todo. */
  title: string;
  priority: Priority;
}

export interface RoadmapDay {
  /** 1..79 */
  day: number;
  /** YYYY-MM-DD */
  date: string;
  weekday: string;
  lesson: Lesson;
  section: Section;
  tasks: RoadmapTask[];
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function sectionForDay(day: number): Section {
  return (
    SECTIONS.find((s) => day >= s.fromDay && day <= s.toDay) ?? SECTIONS[SECTIONS.length - 1]
  );
}

/**
 * The two tasks for a day. The `Day N ·` prefix is what marks a todo as
 * generated, so the sync can tell its own rows from ones you typed yourself.
 */
export function tasksForDay(day: number, lesson: Lesson): RoadmapTask[] {
  return [
    {
      kind: "watch",
      title: `Day ${day} · Watch — ${lesson.title} (${lesson.duration})`,
      priority: "High",
    },
    {
      kind: "build",
      title: `Day ${day} · Build — implement what you learned from ${lesson.title}`,
      priority: "High",
    },
  ];
}

/** Builds the full 79-day plan. Pure — same output every time. */
export function buildRoadmap(): RoadmapDay[] {
  return LESSONS.map((lesson, i) => {
    const day = i + 1;
    const date = addDays(ROADMAP_START, i);
    return {
      day,
      date,
      weekday: WEEKDAYS[new Date(`${date}T00:00:00.000Z`).getUTCDay()],
      lesson,
      section: sectionForDay(day),
      tasks: tasksForDay(day, lesson),
    };
  });
}

/** The instant stored on a todo for a given calendar day. */
export function todoTimestamp(date: string): string {
  return calendarDay(date).toISOString();
}

/** Total runtime of the course, as "Xh Ym". */
export function totalRuntime(): string {
  let seconds = 0;
  for (const l of LESSONS) {
    const parts = l.duration.split(":").map(Number);
    while (parts.length < 3) parts.unshift(0);
    seconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const h = Math.floor(seconds / 3600);
  return `${h}h ${Math.round((seconds % 3600) / 60)}m`;
}
