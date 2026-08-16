/**
 * 100-Day Paid Internship Roadmap
 * --------------------------------
 * Single source of truth for the plan. Both the server (task sync) and the
 * client (Roadmap page) import from here so the schedule can never drift.
 *
 * Inputs it is built from:
 *  - The weekly college timetable (identical every week, day-wise).
 *  - 1 hour of travel each way, so every campus day is padded by 2 hours.
 *  - 1 hour of exercise, every day.
 *  - Coding time always exceeds class time by at least an hour.
 *  - The 100xdevs Web Dev + DevOps cohort curriculum.
 *
 * The timetable and travel shape *when* the blocks sit, but classes and college
 * work are not emitted as tasks — those are handled off-app. Only the
 * internship work lands in the task list: exercise, lectures, builds, DSA,
 * ships and career moves.
 */
import { calendarDay } from "./date";

export const ROADMAP_GOAL = {
  title: "Paid Internship in Next 100 Days",
  description:
    "Land a paid software engineering internship by 24 Nov 2026. " +
    "Finish the 100xdevs Web Dev + DevOps cohort, ship 4 portfolio-grade projects, " +
    "clear DSA fundamentals, and run a disciplined application campaign — " +
    "all around the fixed college timetable.",
} as const;

/** Day 1 of the plan. Monday. */
export const ROADMAP_START = "2026-08-17";
export const ROADMAP_DAYS = 100;

export type Priority = "Low" | "Medium" | "High";

export type BlockKind =
  | "health"
  | "college"
  | "collegework"
  | "lecture"
  | "build"
  | "dsa"
  | "ship"
  | "career";

interface Block {
  start: string;
  end: string;
  hours: number;
  kind: BlockKind;
  /** Fixed text, used by `health` / `college` blocks. */
  label?: string;
  /** Index into the week's `lectures` / `build` / `career` pools. */
  slot?: number;
  /** DSA problems to solve in this block. */
  problems?: number;
  /** College subject focus for `collegework` blocks. */
  subject?: string;
}

interface DayTemplate {
  /** Human label for the Roadmap page. */
  weekday: string;
  /** Out-of-house window including travel, or null on a free day. */
  campusWindow: string | null;
  /** Classes as they appear on the timetable. */
  classes: string;
  /** Contact hours on campus. */
  classHours: number;
  /** Total coding hours scheduled — always classHours + 1 or more. */
  codingHours: number;
  blocks: Block[];
}

/** "17:30" → "5:30pm". Blocks are authored in 24h; everything shown is 12h. */
export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
}

const PRIORITY: Record<BlockKind, Priority> = {
  health: "Medium",
  college: "Low",
  collegework: "Medium",
  lecture: "High",
  build: "High",
  dsa: "Medium",
  ship: "High",
  career: "High",
};

/**
 * The week, day by day. Index 0 = Sunday, matching `Date#getUTCDay()`.
 *
 * Campus gaps are used deliberately: Monday has a 3-hour hole between 10:00
 * and 13:00, and Wed/Thu/Fri each have an hour, so college work and the
 * portable work (DSA) happen there instead of eating into the evening.
 */
export const WEEK: DayTemplate[] = [
  // ---------------------------------------------------------------- SUNDAY
  {
    weekday: "Sunday",
    campusWindow: null,
    classes: "No classes — full build day",
    classHours: 0,
    codingHours: 9,
    blocks: [
      { start: "06:00", end: "07:00", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:30", end: "10:30", hours: 3, kind: "build", slot: 7 },
      { start: "11:00", end: "13:00", hours: 2, kind: "lecture", slot: 5 },
      { start: "14:00", end: "15:30", hours: 1.5, kind: "collegework", subject: "Assignment catch-up + prep for next week's classes" },
      { start: "15:30", end: "17:30", hours: 2, kind: "dsa", problems: 4 },
      { start: "18:30", end: "20:30", hours: 2, kind: "ship", slot: 8 },
      { start: "21:00", end: "22:00", hours: 1, kind: "career", slot: 1 },
    ],
  },
  // ---------------------------------------------------------------- MONDAY
  {
    weekday: "Monday",
    campusWindow: "7:00am – 4:00pm",
    classes: "ENG003 ×2 (8–10am), CS236 (1–2pm), CMP513 (2–3pm)",
    classHours: 4,
    codingHours: 5.5,
    blocks: [
      { start: "05:30", end: "06:30", hours: 1, kind: "health", label: "Workout + stretch" },
      {
        start: "07:00",
        end: "16:00",
        hours: 9,
        kind: "college",
        label: "College + travel — ENG003 ×2, CS236, CMP513 (leave 7:00am, home 4:00pm)",
      },
      { start: "10:00", end: "11:30", hours: 1.5, kind: "collegework", subject: "ENG003 Optimization Techniques + CS236 Theory of Computation" },
      { start: "11:30", end: "13:00", hours: 1.5, kind: "dsa", problems: 3 },
      { start: "16:30", end: "19:00", hours: 2.5, kind: "lecture", slot: 0 },
      { start: "19:45", end: "21:15", hours: 1.5, kind: "build", slot: 0 },
    ],
  },
  // --------------------------------------------------------------- TUESDAY
  {
    weekday: "Tuesday",
    campusWindow: "12:00pm – 5:00pm",
    classes: "CS236 (1–2pm), CMP513 (2–3pm), CS330 (3–4pm)",
    classHours: 3,
    codingHours: 6,
    blocks: [
      { start: "05:30", end: "06:30", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:00", end: "10:00", hours: 3, kind: "lecture", slot: 1 },
      { start: "10:00", end: "11:30", hours: 1.5, kind: "collegework", subject: "CS330 Software Engineering + CMP513 Computer Graphics" },
      {
        start: "12:00",
        end: "17:00",
        hours: 5,
        kind: "college",
        label: "College + travel — CS236, CMP513, CS330 (leave 12:00pm, home 5:00pm)",
      },
      { start: "17:30", end: "19:00", hours: 1.5, kind: "build", slot: 1 },
      { start: "19:45", end: "21:15", hours: 1.5, kind: "dsa", problems: 3 },
    ],
  },
  // ------------------------------------------------------------- WEDNESDAY
  {
    weekday: "Wednesday",
    campusWindow: "8:00am – 4:00pm",
    classes: "TEC101 (9–10am), CS344 (10–11am), CS321 (11am–12pm), CMP513 (12–1pm), CS330 (2–3pm)",
    classHours: 5,
    codingHours: 6,
    blocks: [
      { start: "05:30", end: "06:30", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:00", end: "08:00", hours: 1, kind: "dsa", problems: 2 },
      {
        start: "08:00",
        end: "16:00",
        hours: 8,
        kind: "college",
        label: "College + travel — TEC101, CS344, CS321, CMP513, CS330 (leave 8:00am, home 4:00pm)",
      },
      { start: "13:00", end: "14:00", hours: 1, kind: "collegework", subject: "CS344 Mobile App Development + CS321 Information Security" },
      { start: "16:30", end: "17:00", hours: 0.5, kind: "collegework", subject: "Submissions due + notes tidy-up" },
      { start: "17:00", end: "19:30", hours: 2.5, kind: "lecture", slot: 2 },
      { start: "20:00", end: "22:30", hours: 2.5, kind: "build", slot: 2 },
    ],
  },
  // -------------------------------------------------------------- THURSDAY
  {
    weekday: "Thursday",
    campusWindow: "8:00am – 4:00pm",
    classes: "TEC101 (9–10am), CS344 (10–11am), CS321 (11am–12pm), CS330 (1–2pm), CS236 (2–3pm)",
    classHours: 5,
    codingHours: 6,
    blocks: [
      { start: "05:30", end: "06:30", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:00", end: "08:00", hours: 1, kind: "dsa", problems: 2 },
      {
        start: "08:00",
        end: "16:00",
        hours: 8,
        kind: "college",
        label: "College + travel — TEC101, CS344, CS321, CS330, CS236 (leave 8:00am, home 4:00pm)",
      },
      { start: "12:00", end: "13:00", hours: 1, kind: "collegework", subject: "TEC101 Renewable Energy + CS236 Theory of Computation" },
      { start: "16:30", end: "17:00", hours: 0.5, kind: "collegework", subject: "Submissions due + notes tidy-up" },
      { start: "17:00", end: "19:30", hours: 2.5, kind: "lecture", slot: 3 },
      { start: "20:00", end: "22:30", hours: 2.5, kind: "build", slot: 3 },
    ],
  },
  // ---------------------------------------------------------------- FRIDAY
  {
    weekday: "Friday",
    campusWindow: "9:00am – 4:00pm",
    classes: "CMP514 Graphics Lab (10am–12pm), CS331 SE Lab (1–3pm)",
    classHours: 4,
    codingHours: 6,
    blocks: [
      { start: "05:30", end: "06:30", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:00", end: "09:00", hours: 2, kind: "lecture", slot: 4 },
      {
        start: "09:00",
        end: "16:00",
        hours: 7,
        kind: "college",
        label: "College + travel — CMP514 Graphics Lab, CS331 SE Lab (leave 9:00am, home 4:00pm)",
      },
      { start: "12:00", end: "13:00", hours: 1, kind: "collegework", subject: "CMP514 lab file + CS331 SE lab record" },
      { start: "16:30", end: "19:30", hours: 3, kind: "build", slot: 4 },
      { start: "20:00", end: "20:30", hours: 0.5, kind: "collegework", subject: "Lab write-ups + next week's prep" },
      { start: "20:30", end: "21:30", hours: 1, kind: "career", slot: 0 },
    ],
  },
  // -------------------------------------------------------------- SATURDAY
  {
    weekday: "Saturday",
    campusWindow: "9:00am – 1:00pm",
    classes: "CS347 Mobile App Dev Lab (10am–12pm)",
    classHours: 2,
    codingHours: 6.5,
    blocks: [
      { start: "06:00", end: "07:00", hours: 1, kind: "health", label: "Workout + stretch" },
      { start: "07:30", end: "09:00", hours: 1.5, kind: "dsa", problems: 3 },
      {
        start: "09:00",
        end: "13:00",
        hours: 4,
        kind: "college",
        label: "College + travel — CS347 Mobile App Dev Lab (leave 9:00am, home 1:00pm)",
      },
      { start: "14:00", end: "17:00", hours: 3, kind: "build", slot: 5 },
      { start: "17:30", end: "19:00", hours: 1.5, kind: "collegework", subject: "CS347 lab record + weekly revision of all subjects" },
      { start: "19:45", end: "21:45", hours: 2, kind: "ship", slot: 6 },
    ],
  },
];

/** How the college-work block is framed, rotating week to week. */
const COLLEGE_MODES = [
  "assignments",
  "lab records + practical files",
  "revision + notes",
  "unit-test prep",
];

export interface Phase {
  name: string;
  fromDay: number;
  toDay: number;
  focus: string;
}

export const PHASES: Phase[] = [
  { name: "Phase 1 · Foundations & Backend Core", fromDay: 1, toDay: 14, focus: "JavaScript, async, DOM, Node.js, Express, HTTP and auth. Get fast at the basics before anything else." },
  { name: "Phase 2 · Databases & React", fromDay: 15, toDay: 28, focus: "MongoDB, zod, bcrypt, the course-selling backend, then React fundamentals. First full-stack app shipped." },
  { name: "Phase 3 · TypeScript, Tailwind & Project #1", fromDay: 29, toDay: 42, focus: "Recoil, UI/UX primitives, Tailwind, TypeScript, and the Second Brain app. Applications start." },
  { name: "Phase 4 · Realtime, SQL & Next.js", fromDay: 43, toDay: 56, focus: "WebSockets, Postgres, Prisma, Next.js and NextAuth. Ship Brainly and a realtime chat app." },
  { name: "Phase 5 · Monorepos, PayTM & Excalidraw", fromDay: 57, toDay: 70, focus: "Turborepo, the PayTM wallet, and the Excalidraw clone — the two heaviest portfolio pieces." },
  { name: "Phase 6 · DevOps: VMs → Docker → AWS", fromDay: 71, toDay: 84, focus: "Linux, nginx, CI/CD, certificates, Docker, autoscaling, ECS, Prometheus and Grafana." },
  { name: "Phase 7 · Kubernetes, Capstone & Interview Sprint", fromDay: 85, toDay: 100, focus: "Kubernetes, GitOps, the Betterstack capstone, system design, and an all-out application push." },
];

interface WeekPlan {
  week: number;
  phase: string;
  theme: string;
  milestone: string;
  dsa: string;
  /** 6 slots: Mon, Tue, Wed, Thu, Fri, Sun. */
  lectures: string[];
  /** 9 slots: Mon, Tue, Wed, Thu, Fri, Sat-build, Sat-ship, Sun-build, Sun-ship. */
  build: string[];
  /** 2 slots: Fri, Sun. */
  career: string[];
}

export const WEEK_PLANS: WeekPlan[] = [
  {
    week: 1,
    phase: "Phase 1",
    theme: "JavaScript and the browser, cold",
    milestone: "5 vanilla-JS mini apps on GitHub, daily commit streak started",
    dsa: "Arrays & Strings",
    lectures: [
      "1.1 Web Dev + DevOps Orientation + 1.2 JavaScript Basics",
      "2.1 Async JS",
      "2.2 Promises",
      "3.1 DOM (Simple)",
      "3.2 DOM (Advanced)",
      "Revision — re-watch the weakest lecture of the week at 1.5x, redo its assignment",
    ],
    build: [
      "Mini app 1 — calculator in vanilla JS, no framework",
      "Mini app 2 — todo list persisted to localStorage",
      "Re-implement map / filter / reduce / forEach from scratch",
      "Mini app 3 — weather app using fetch + async/await",
      "Write your own Promise class: then, catch, finally, Promise.all",
      "Mini app 4 — quiz app with a timer and score screen",
      "Deploy all 4 mini apps to GitHub Pages, one repo each with a README",
      "Mini app 5 — infinite-scroll image gallery with IntersectionObserver",
      "Week 1 write-up: what clicked, what didn't. Push everything, tag v1",
    ],
    career: [
      "Clean up the GitHub profile: real name, photo, bio, pinned repos, profile README",
      "Set up the tracking sheet: companies, roles, dates, status. Set the green-squares rule — a commit every single day for 100 days",
    ],
  },
  {
    week: 2,
    phase: "Phase 1",
    theme: "Node, Express and HTTP end to end",
    milestone: "A deployed REST API with JWT auth, middleware and CORS",
    dsa: "Hashing & Two Pointers",
    lectures: [
      "4.1 Node.js, Bun and JS runtimes",
      "4.2 HTTP Servers (Express)",
      "5.1 Headers and Query parameters",
      "5.2 Middlewares and CORS",
      "6.1 HTTP Deep dive and Auth in Node.js",
      "6.2 Auth and connecting FE to BE",
    ],
    build: [
      "Scaffold TaskFlow API — Express, folder structure, nodemon, env config",
      "CRUD routes with in-memory storage + a Postman/Thunder collection",
      "Global error-handling middleware, request logging, input validation",
      "Auth: signup / signin with bcrypt hashing and JWT",
      "Auth middleware, protected routes, refresh tokens, CORS for a browser client",
      "Rate limiting + a tiny HTML frontend that talks to the API",
      "Deploy TaskFlow API to Render, write the README with every endpoint documented",
      "Rebuild a bare HTTP server with node:http — no Express — to see what it does for you",
      "Ship: tag v1, post the repo link, ask one senior dev for a code review",
    ],
    career: [
      "Resume v1 — one page, no photo, no objective. Projects above education",
      "Read 10 real internship JDs. List every skill you don't have yet and mark which weeks cover them",
    ],
  },
  {
    week: 3,
    phase: "Phase 2",
    theme: "MongoDB and the course-selling backend",
    milestone: "Course-selling backend live on the internet with a public URL",
    dsa: "Sliding Window & Prefix Sums",
    lectures: [
      "7.1 MongoDB",
      "7.2 Passwords, zod",
      "8.1 Backend of Course selling app",
      "8.2 Backend of Course selling app — Part 2",
      "Catch-up + deploy: fix everything broken from 8.1 and 8.2",
      "9.1 React Basics",
    ],
    build: [
      "MongoDB Atlas set up, Mongoose models, connect TaskFlow API to a real database",
      "Zod schemas on every route; replace all hand-rolled validation",
      "Course app: user / admin / course / purchase models and the auth routes",
      "Course app: admin routes — create, update, delete, list own courses",
      "Course app: user routes — browse, purchase, my-courses",
      "Middleware split for admin vs user auth; refactor into routers",
      "Deploy the course backend + Atlas to Render, seed sample data",
      "Write integration tests for the 8 most important endpoints",
      "Ship: public URL + API docs in the README + Postman collection link",
    ],
    career: [
      "LinkedIn overhaul — headline, about section, projects, banner. Follow 25 engineers hiring interns",
      "Join 3 communities where internships get posted (Discord / Telegram / Slack). Turn on alerts",
    ],
  },
  {
    week: 4,
    phase: "Phase 2",
    theme: "React core and the first full-stack ship",
    milestone: "Full-stack course-selling app live — this is portfolio project #1",
    dsa: "Recursion & Backtracking basics",
    lectures: [
      "9.2 React useState",
      "9.3 React from basics — Part 1",
      "9.4 React from basics — Part 2 + 10.1 React Part 2 (SPAs, routing)",
      "10.2 React Part 3 (Context API, rolling up state)",
      "11.1 Custom Hooks, useDebounce, useFetch",
      "Catch-up — re-watch whatever from React week didn't land",
    ],
    build: [
      "Vite + React app scaffolded; component tree for the course app drawn on paper first",
      "Signup / signin pages wired to the real backend, JWT in localStorage",
      "Course listing + course detail pages, loading and error states",
      "React Router: protected routes, admin dashboard, 404 page",
      "Context for auth state; kill every piece of prop drilling",
      "Admin panel: create / edit / delete a course, with optimistic updates",
      "Deploy the frontend to Vercel, point it at the Render backend, fix the CORS fallout",
      "Polish pass: empty states, skeletons, mobile layout, favicon, meta tags",
      "Ship project #1 — README with screenshots, live link, and a 90-second Loom demo",
    ],
    career: [
      "Resume v2 — add project #1 with metrics. Get it reviewed by 2 people",
      "Buy a domain and put up the portfolio skeleton: hero, projects, about, contact",
    ],
  },
  {
    week: 5,
    phase: "Phase 3",
    theme: "State management and UI that doesn't look student-made",
    milestone: "Portfolio site live, project #1 redesigned to a professional standard",
    dsa: "Sorting & Binary Search",
    lectures: [
      "11.2 State management using Recoil",
      "11.3 Recoil Deep dive",
      "12.1 UI/UX Primitives by Keshav — Part 1",
      "12.2 UI/UX Primitives by Keshav — Part 2",
      "13.1 Tailwind, ref arrays and building components",
      "13.2 Tailwind Part 2, creating sidebars",
    ],
    build: [
      "Custom hooks library: useDebounce, useFetch, useLocalStorage, useOnClickOutside",
      "Recoil atoms and selectors replacing Context in the course app",
      "Recoil async selectors + loadable for the course list",
      "Rebuild the course app UI with the UI/UX primitives from the lecture",
      "Tailwind refactor: design tokens, spacing scale, dark mode",
      "Build a sidebar + navbar shell that you can reuse in every future project",
      "Portfolio site: real content, real projects, deployed to your domain",
      "Accessibility and Lighthouse pass on the portfolio — aim for 95+",
      "Ship: post the portfolio publicly and ask for feedback in your 3 communities",
    ],
    career: [
      "Write the 3 stories you'll tell in every interview: hardest bug, thing you shipped, thing you learned fastest",
      "Shortlist 40 target companies. Find one real human at each and note how to reach them",
    ],
  },
  {
    week: 6,
    phase: "Phase 3",
    theme: "TypeScript and the Second Brain app",
    milestone: "Applications open — first 5 out the door",
    dsa: "Linked Lists",
    lectures: [
      "14.1 TypeScript Part 1",
      "14.2 Types, Interfaces and implementing interfaces",
      "14.3 TypeScript Advanced APIs + 15.1 End-to-end app in TS: Second Brain",
      "15.2 Creating a UI Library, Button component",
      "15.3 Brainly end to end — Part 1",
      "15.3 Brainly end to end — Part 2",
    ],
    build: [
      "Convert the TaskFlow API to TypeScript; zero `any` allowed",
      "Generics, utility types, discriminated unions — 20 exercises",
      "Brainly backend in TS: content, tags, links, share models",
      "Brainly auth + zod + typed request handlers",
      "Build the Button / Input / Card components of your own UI library",
      "Brainly frontend: sidebar, content grid, add-content modal",
      "Publish the UI library to npm under your own scope",
      "Brainly: share-a-brain public link feature",
      "Ship: Brainly deployed end to end, TypeScript strict mode on",
    ],
    career: [
      "Apply to 5 internships this week. Every one gets a tailored first line, no mass blasting",
      "Cold-DM 5 engineers at target companies. Ask one specific question, don't ask for a referral yet",
    ],
  },
  {
    week: 7,
    phase: "Phase 4",
    theme: "WebSockets and relational databases",
    milestone: "Realtime chat app shipped; project #2 (Brainly) in the portfolio",
    dsa: "Stacks & Queues",
    lectures: [
      "16.1 WebSockets",
      "16.2 WebSockets Project — Chat app",
      "17.1 Postgres and SQL databases",
      "17.2 Postgres and SQL databases — Part 2",
      "18.1 Prisma and ORMs",
      "Catch-up + ship: everything half-finished from this week",
    ],
    build: [
      "Raw ws server: rooms, broadcast, ping/pong heartbeat",
      "Chat app frontend: rooms, presence, typing indicator",
      "Chat app: message history persisted, reconnect logic",
      "SQL drills: joins, group by, indexes, explain analyze — 20 queries by hand",
      "Design the Brainly schema in Postgres; write the migrations by hand",
      "Prisma schema, migrations, and a seed script",
      "Migrate Brainly from Mongo to Postgres + Prisma; compare the query code",
      "Deploy the chat app with a managed Postgres and a WebSocket-capable host",
      "Ship: chat app live, Brainly on Postgres, both READMEs updated",
    ],
    career: [
      "Apply to 10 internships. Track response rate — if it's under 10%, the resume is the problem, not the market",
      "First mock interview: 45 minutes, one DSA problem plus project deep-dive. Record it and watch it back",
    ],
  },
  {
    week: 8,
    phase: "Phase 4",
    theme: "Next.js, NextAuth and monorepos",
    milestone: "A server-rendered Next.js app deployed, monorepo set up",
    dsa: "Trees & BST",
    lectures: [
      "18.2 Starting Next.js, introducing SSR",
      "19.1 Next.js continuation",
      "20.1 Next.js Continued",
      "20.2 NextAuth",
      "21.3 CSR vs SSR vs SSG + 21.1 Monorepos and Turborepo",
      "21.2 Monorepos Continued",
    ],
    build: [
      "First Next.js app: app router, layouts, server components",
      "Server actions, data fetching, loading and error boundaries",
      "Port the Brainly frontend to Next.js with SSR on the public share page",
      "NextAuth: Google + credentials providers, session handling, middleware",
      "Turborepo: apps/web, apps/api, packages/ui, packages/db",
      "Move your UI library and Prisma client into shared packages",
      "Deploy the monorepo to Vercel with the right build filters and caching",
      "Add end-to-end type safety across the monorepo boundary",
      "Ship: monorepo deployed, README explaining the architecture and why",
    ],
    career: [
      "Apply to 10 more. Follow up on week 6 and 7 applications that went silent",
      "Ask 5 people for a referral now that you have 3 shipped projects to point at",
    ],
  },
  {
    week: 9,
    phase: "Phase 5",
    theme: "PayTM wallet and the start of Excalidraw",
    milestone: "PayTM shipped — the project that proves you understand transactions",
    dsa: "Graphs (BFS / DFS)",
    lectures: [
      "21.4 Building PayTM Project",
      "21.5 PayTM Frontend",
      "22.1 End to End Project #1 — Excalidraw",
      "22.2 Excalidraw — Part 2",
      "23.1 Excalidraw — Part 3",
      "23.2 Excalidraw — Part 4",
    ],
    build: [
      "PayTM: monorepo scaffold, Prisma schema for users, accounts, transactions",
      "PayTM: signup, signin, balance, and the bank webhook",
      "PayTM: peer-to-peer transfer inside a database transaction — get the locking right",
      "PayTM frontend: dashboard, send money, transaction history",
      "Excalidraw: canvas rendering, shape model, pointer events",
      "Excalidraw: WebSocket room, broadcasting shape updates",
      "Ship PayTM — deployed, with a written note on how you prevented double-spend",
      "Excalidraw: selection, drag, resize, delete",
      "Ship: Excalidraw v0 deployed, even if rough",
    ],
    career: [
      "Apply to 12. Start including a one-paragraph 'here's what I'd build for you' note",
      "First open-source PR — pick a repo you actually use, fix a real issue, however small",
    ],
  },
  {
    week: 10,
    phase: "Phase 5",
    theme: "Finish Excalidraw, then step into DevOps",
    milestone: "Excalidraw complete and deployed on your own VM with SSL",
    dsa: "Heaps & Priority Queues",
    lectures: [
      "24.1 Starting DevOps, VMs",
      "24.2 Reverse Proxies, Process Management and Deployment",
      "25 Process management and CI/CD (1 of 2)",
      "25 Continuing CI, certificate management and testing (2 of 2)",
      "Certificate Management (Cohort 2)",
      "26.1 Starting Docker",
    ],
    build: [
      "Excalidraw: persistence — save and load a drawing from Postgres",
      "Excalidraw: multiplayer cursors and conflict handling",
      "Rent a VM. SSH keys, users, firewall, no root login",
      "nginx as a reverse proxy in front of the Excalidraw backend; pm2 for process management",
      "GitHub Actions: build, test and deploy to the VM on every push to main",
      "Certbot + Let's Encrypt, auto-renewal, HTTPS everywhere",
      "Excalidraw live on your own domain over HTTPS — take the screenshot for the portfolio",
      "Write a runbook: how to deploy, how to roll back, what to check when it's down",
      "Ship: Excalidraw v1 + the runbook in the repo",
    ],
    career: [
      "Apply to 12. Two of these should be companies you'd be genuinely thrilled by — write those by hand",
      "Two mock interviews this week. One DSA, one system design. Different people",
    ],
  },
  {
    week: 11,
    phase: "Phase 6",
    theme: "Docker and shipping the same way real teams do",
    milestone: "The whole monorepo dockerized and deployed through CI",
    dsa: "Greedy",
    lectures: [
      "26.2 Docker Part 2",
      "27.1 Docker Compose, CI/CD with Docker",
      "27.2 Deploying a monorepo using Docker to VMs",
      "28.1 Vertical and horizontal scaling, ASGs",
      "28.2 Autoscaling Groups",
      "29.1 Building an autoscaling orchestrator — Project class",
    ],
    build: [
      "Dockerfile for the API: multi-stage, non-root user, small final image",
      "Dockerfile for the Next.js app; measure and cut the image size in half",
      "docker-compose: api, web, postgres, redis — the whole stack with one command",
      "Push images to a registry from GitHub Actions; deploy by pulling on the VM",
      "Load-test the API and find the point where it falls over. Write the number down",
      "Put a load balancer in front of two API instances",
      "Autoscaling experiment: scale up under load, scale back down after",
      "Health checks, graceful shutdown, zero-downtime deploys",
      "Ship: blog post #1 — 'How I deploy a monorepo with Docker and GitHub Actions'",
    ],
    career: [
      "Apply to 15. Include the DevOps work now — very few interns can deploy their own infrastructure",
      "Publish blog post #1 on Hashnode or dev.to and share it on LinkedIn and X",
    ],
  },
  {
    week: 12,
    phase: "Phase 6",
    theme: "AWS, monitoring and serverless",
    milestone: "Running on ECS with Prometheus and Grafana dashboards",
    dsa: "Dynamic Programming — Part 1",
    lectures: [
      "30.1 AWS ECR, ECS and container orchestration",
      "30.2 Monitoring and New Relic",
      "31.1 Monitoring, Prometheus and Grafana",
      "32.1 Prometheus and Grafana — Part 2",
      "33.1 Serverless",
      "33.2 Kubernetes — Architecture, Control Plane, Worker Nodes, Pods",
    ],
    build: [
      "AWS account, IAM users and roles done properly. Never use the root account again",
      "Push images to ECR; run the API as an ECS service behind an ALB",
      "Structured logging with request IDs across every service",
      "Prometheus scraping custom metrics from the API",
      "Grafana dashboards: latency, error rate, throughput, saturation",
      "Alerting rules that actually page you when something breaks",
      "One Lambda function doing real work — thumbnail generation or an email queue",
      "Cost review: what is this costing per month, and where would you cut it",
      "Ship: a public Grafana screenshot in the portfolio + a write-up of what you monitor and why",
    ],
    career: [
      "Apply to 15. Prioritise companies where someone has already replied to you",
      "Two mock interviews. Ask each interviewer for the single thing they'd fix about how you present",
    ],
  },
  {
    week: 13,
    phase: "Phase 7",
    theme: "Kubernetes and the capstone begins",
    milestone: "The monorepo running on Kubernetes; capstone scaffolded",
    dsa: "Dynamic Programming — Part 2",
    lectures: [
      "34.1 Kubernetes Part 2",
      "34.2 Kubernetes Part 3",
      "35.1 Namespaces, ClusterIP and Ingress",
      "36.1 Secrets, ConfigMaps and Ingress",
      "36.2 Secrets and ConfigMap Part 2 + Kubernetes Part 5 (Volumes, PV, PVCs)",
      "37.1 Horizontal Pod Autoscaler, Node Autoscaler",
    ],
    build: [
      "Local cluster with kind or minikube; deploy one pod and understand every line of the manifest",
      "Deployments, Services, and an Ingress for the API and the web app",
      "ConfigMaps and Secrets — no credentials in any manifest, ever",
      "Persistent volumes for Postgres; back it up and restore it once to prove it works",
      "Capstone: Betterstack-style uptime monitor — schema, API, worker design doc",
      "Capstone: the checker worker plus the incident model",
      "Horizontal Pod Autoscaler under a synthetic load spike",
      "Capstone: dashboard UI — monitors, status, incident timeline",
      "Ship: the monorepo running on Kubernetes, manifests committed",
    ],
    career: [
      "Apply to 15. Send a polite follow-up to every application older than 10 days",
      "Blog post #2 — 'What I learned deploying to Kubernetes as a student'. Publish and share",
    ],
  },
  {
    week: 14,
    phase: "Phase 7",
    theme: "GitOps, the capstone ships, and interviews get real",
    milestone: "Capstone live with workers, autoscaling and monitoring",
    dsa: "Mixed revision + timed mocks",
    lectures: [
      "37.2 ArgoCD and GitOps",
      "38 Helm + 48.1 Deploy Anything with Coolify",
      "39 Project class — Creating Betterstack (Part 1)",
      "42.1 Async Backend Communication and Redis streams (Betterstack Part 4)",
      "43.1 Adding worker and Pusher using Redis streams in JS + 43.2 Finishing the frontend",
      "44.1 Scaling HTTP Servers and WS Servers",
    ],
    build: [
      "Helm chart for the whole stack; one command to install, one to roll back",
      "ArgoCD watching the repo — git push becomes the only way anything reaches production",
      "Capstone: Redis streams between the API and the checker workers",
      "Capstone: multiple workers across regions, consumer groups, at-least-once delivery",
      "Capstone: realtime status updates pushed to the frontend",
      "Capstone: alerting — email and webhook when a monitor goes down",
      "Ship the capstone: live URL, real monitors running, public status page",
      "Load-test the capstone and publish the numbers in the README",
      "Ship: capstone architecture diagram + a 3-minute demo video",
    ],
    career: [
      "Apply to 20 — the biggest week. Every project is now shipped and demonstrable",
      "Three mock interviews. Prepare salary and stipend expectations, and how you'd answer a lowball",
    ],
  },
  {
    week: 15,
    phase: "Phase 7",
    theme: "Close it out",
    milestone: "Day 100 — every application followed up, portfolio final",
    dsa: "Final revision — your 40 weakest problems, again",
    lectures: [
      "45.1 OpenAPI spec, autogenerated clients, rate limiting, captcha, DDoS protection",
      "51.1 Sharding, Replication and System Design",
      "",
      "",
      "",
      "",
    ],
    build: [
      "Final pass — every project has a live link, a demo video, a README and rate limiting on public endpoints",
      "Day 100 — follow up on every open application and ask directly for a decision. Then write the day-101 plan",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    career: ["", ""],
  },
];

export interface RoadmapTask {
  /** 24h "HH:MM", used for ordering only. */
  start: string;
  end: string;
  /** 12h labels, as they appear to the user. */
  startLabel: string;
  endLabel: string;
  hours: number;
  kind: BlockKind;
  /** Title as it is stored on the todo, time prefix included. */
  title: string;
  priority: Priority;
}

export interface RoadmapDay {
  /** 1..100 */
  day: number;
  /** YYYY-MM-DD */
  date: string;
  weekday: string;
  week: number;
  phase: Phase;
  theme: string;
  milestone: string;
  campusWindow: string | null;
  classes: string;
  classHours: number;
  codingHours: number;
  tasks: RoadmapTask[];
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function phaseForDay(day: number): Phase {
  return PHASES.find((p) => day >= p.fromDay && day <= p.toDay) ?? PHASES[PHASES.length - 1];
}

function titleFor(block: Block, plan: WeekPlan, weekIndex: number): string | null {
  const hrs = block.hours === 1 ? "1 h" : `${block.hours} h`;

  switch (block.kind) {
    case "health":
      return `${block.label} (${hrs})`;
    case "college":
      return block.label!;
    case "collegework":
      return `College work — ${block.subject} · ${COLLEGE_MODES[weekIndex % COLLEGE_MODES.length]} (${hrs})`;
    case "dsa":
      return `DSA — ${plan.dsa} · ${block.problems} problems (${hrs})`;
    case "lecture": {
      const lecture = plan.lectures[block.slot!];
      if (!lecture) return null;
      return `Lecture — ${lecture} (${hrs})`;
    }
    case "build": {
      const item = plan.build[block.slot!];
      if (!item) return null;
      return `Build — ${item} (${hrs})`;
    }
    case "ship": {
      const item = plan.build[block.slot!];
      if (!item) return null;
      return `Ship — ${item} (${hrs})`;
    }
    case "career": {
      const item = plan.career[block.slot!];
      if (!item) return null;
      return `Career — ${item} (${hrs})`;
    }
  }
}

/** Builds the full 100-day plan. Pure — same output every time. */
export function buildRoadmap(): RoadmapDay[] {
  const days: RoadmapDay[] = [];

  for (let i = 0; i < ROADMAP_DAYS; i++) {
    const date = addDays(ROADMAP_START, i);
    const weekIndex = Math.floor(i / 7);
    const plan = WEEK_PLANS[Math.min(weekIndex, WEEK_PLANS.length - 1)];
    const template = WEEK[new Date(`${date}T00:00:00.000Z`).getUTCDay()];
    const day = i + 1;

    const tasks: RoadmapTask[] = [];
    for (const block of template.blocks) {
      // Classes and college work stay off the task list — they only exist in
      // the templates so the internship blocks land in genuinely free time.
      if (block.kind === "college" || block.kind === "collegework") continue;

      const title = titleFor(block, plan, weekIndex);
      if (!title) continue;
      tasks.push({
        start: block.start,
        end: block.end,
        startLabel: to12h(block.start),
        endLabel: to12h(block.end),
        hours: block.hours,
        kind: block.kind,
        title: `${to12h(block.start)}–${to12h(block.end)} · ${title}`,
        priority: PRIORITY[block.kind],
      });
    }
    tasks.sort((a, b) => a.start.localeCompare(b.start));

    days.push({
      day,
      date,
      weekday: template.weekday,
      week: plan.week,
      phase: phaseForDay(day),
      theme: plan.theme,
      milestone: plan.milestone,
      campusWindow: template.campusWindow,
      classes: template.classes,
      classHours: template.classHours,
      codingHours: template.codingHours,
      tasks,
    });
  }

  return days;
}

/** The instant stored on a todo for a given calendar day. */
export function todoTimestamp(date: string): string {
  return calendarDay(date).toISOString();
}
