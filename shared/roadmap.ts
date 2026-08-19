/**
 * Two courses, one plan
 * ---------------------
 * Web Dev and Web 3 run side by side from the same start date. Each lecture
 * takes two days: watch it, then spend the next day building something with
 * it. So a track is twice as long as its lecture count, and any given day
 * holds one task per track.
 *
 * Both the server (task sync) and the client (Roadmap page) import from here,
 * so the plan can only ever be defined once.
 */
import { calendarDay } from "./date";

/** Day 1 of both tracks. */
export const ROADMAP_START = "2026-08-20";

export type Priority = "Low" | "Medium" | "High";
export type TrackId = "webdev" | "web3";
/** What a given day is for: watching the lecture, or building with it. */
export type Phase = "watch" | "build";

export interface Lesson {
  title: string;
  /** Runtime, as listed in the course. */
  duration: string;
}

export interface Section {
  name: string;
  /** 1-based lecture numbers, not days. */
  fromLesson: number;
  toLesson: number;
  focus: string;
}

export interface Track {
  id: TrackId;
  name: string;
  goalTitle: string;
  goalDescription: string;
  lessons: Lesson[];
  sections: Section[];
}

export const TRACKS: Track[] = [
  {
    id: "webdev",
    name: "Web Dev",
    goalTitle: "Learn Web Dev",
    goalDescription:
      "Finish the web dev cohort start to finish — watch a lecture, then build " +
      "something with it the next day.",
    lessons: [
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
    ],
    sections: [
      { name: "JavaScript & the Browser", fromLesson: 1, toLesson: 10, focus: "The language, the page, and the tools you drive them with." },
      { name: "Node, Express & Auth", fromLesson: 11, toLesson: 21, focus: "Leave the browser: servers, HTTP, middleware, and logging people in." },
      { name: "MongoDB & the Course App", fromLesson: 22, toLesson: 27, focus: "A real database behind a real backend." },
      { name: "React", fromLesson: 28, toLesson: 36, focus: "Components, state, routing, and state management that scales." },
      { name: "UI/UX & Tailwind", fromLesson: 37, toLesson: 40, focus: "Making it look like something you would ship." },
      { name: "TypeScript & Second Brain", fromLesson: 41, toLesson: 46, focus: "Types across the stack, then a full app built with them." },
      { name: "WebSockets & SQL", fromLesson: 47, toLesson: 51, focus: "Realtime, then relational databases and an ORM." },
      { name: "Next.js & Monorepos", fromLesson: 52, toLesson: 58, focus: "SSR, auth, and keeping several apps in one repo." },
      { name: "PayTM & Excalidraw", fromLesson: 59, toLesson: 64, focus: "The two big portfolio projects." },
      { name: "Betterstack", fromLesson: 65, toLesson: 70, focus: "An uptime monitor end to end, workers and all." },
      { name: "Scaling & System Design", fromLesson: 71, toLesson: 79, focus: "Load, limits, sharding — and Replit to finish." },
    ],
  },
  {
    id: "web3",
    name: "Web 3",
    goalTitle: "Learn Web 3",
    goalDescription:
      "Finish the web3 cohort start to finish — Solana, Ethereum, Rust and " +
      "Anchor — watching a lecture, then building with it the next day.",
    lessons: [
      { title: "Orientation (Part 1)", duration: "1:14:03" },
      { title: "Orientation (Part 2)", duration: "1:27:21" },
      { title: "Bitcoin Whitepaper", duration: "56:47" },
      { title: "Public Key Cryptography", duration: "2:54:10" },
      { title: "Public Key Cryptography (Again, From Scratch)", duration: "2:02:18" },
      { title: "DEX, AMMs And Liquidity Pools", duration: "2:36:49" },
      { title: "How To Create A Web Based Wallet", duration: "2:32:41" },
      { title: "Token Program And Solana Data Model, QnA", duration: "1:59:38" },
      { title: "Programs, Smart Contracts And Token Program (Offline)", duration: "2:24:33" },
      { title: "Solana Client Side Apps", duration: "2:32:01" },
      { title: "Token Launchpad In React (Part 1)", duration: "2:07:15" },
      { title: "Accounts, Authorities And Owners In Solana", duration: "1:15:01" },
      { title: "Dapps, Wallet Adapter And Simple Apps", duration: "1:33:42" },
      { title: "Token Launchpad In React (Part 2)", duration: "1:10:32" },
      { title: "Program Derived Addresses", duration: "2:21:49" },
      { title: "ETH, EVM, Bytecode", duration: "2:08:27" },
      { title: "Eth Wallet Adapters", duration: "1:57:40" },
      { title: "Impermanent Loss, Creating A Liquidity Pool", duration: "2:01:34" },
      { title: "LSTs, Coding An LST Platform", duration: "2:02:21" },
      { title: "Private Key Management, Building A Project", duration: "2:31:12" },
      { title: "Intro To Solidity", duration: "2:14:56" },
      { title: "Solidity Part 2", duration: "1:11:09" },
      { title: "Payable, CCIs In ETH", duration: "1:46:04" },
      { title: "ERC-20 And OpenZeplin Contracts", duration: "2:11:59" },
      { title: "Hardhat, Ganache, Foundry", duration: "2:24:22" },
      { title: "Bridges, Building And EVM Bridge", duration: "1:48:46" },
      { title: "Building A Bridge", duration: "1:58:39" },
      { title: "Client Side ETH", duration: "2:31:19" },
      { title: "Upgradability In ETH", duration: "2:35:58" },
      { title: "Building A Proxy Staking Contract", duration: "2:02:26" },
      { title: "Upgradable Staking Contracts — Continued", duration: "2:12:17" },
      { title: "ETH End To End App", duration: "2:21:49" },
      { title: "Birthday Stream And Sharing Alpha (Starting Solana)", duration: "35:56" },
      { title: "Rust Bootcamp Part 1 - Data Types, Conditionals, Loops, Fns, Structs, Enums, Ownership And Borrowing", duration: "2:03:57" },
      { title: "Rust Bootcamp Part 2", duration: "2:02:47" },
      { title: "Rust Part - 3", duration: "2:21:40" },
      { title: "Deriving Macros, Serde, Borsh And Lifetimes", duration: "2:01:51" },
      { title: "Serde, Borsh, Lifetimes, Your First Solana Program", duration: "2:19:11" },
      { title: "Solana Native Contracts In Rust", duration: "2:11:05" },
      { title: "Writing JS Clients For Smart Contracts", duration: "2:00:19" },
      { title: "Building A Coin Flip Game On Solana With Biswa", duration: "1:58:12" },
      { title: "PDAs In Solana", duration: "1:56:02" },
      { title: "CPIs And LiteSVM", duration: "33:37" },
      { title: "CPI", duration: "1:53:31" },
      { title: "Pdas, Bumps And Invoke_signed", duration: "2:24:43" },
      { title: "Anchor Vs Raw Contracts", duration: "2:17:57" },
      { title: "Anchor 2 - CPIS And PDAs In Anchor", duration: "1:35:22" },
      { title: "PDAs In Anchor, Staking Program", duration: "1:24:45" },
      { title: "Private Key Management", duration: "2:18:41" },
      { title: "Creating A Cloud Wallet", duration: "4:01:05" },
      { title: "Telegram Bonk Bot", duration: "1:05:43" },
      { title: "Wrapping Up Web3 Cohort, Colosseum Idea Discussions", duration: "1:17:18" },
      { title: "Building Crypto Centralized Exchange (part 1)", duration: "2:23:07" },
      { title: "Building Crypto Centralized Exchange (part 2)", duration: "1:38:30" },
      { title: "Building Crypto Payment Gateway (Part 1)", duration: "1:45:22" },
      { title: "Building Crypto Payment Gateway (Part 2)", duration: "52:59" },
    ],
    sections: [
      { name: "Foundations", fromLesson: 1, toLesson: 5, focus: "What a blockchain actually is, and the cryptography underneath it." },
      { name: "Solana Basics", fromLesson: 6, toLesson: 15, focus: "Wallets, the token program, the data model, and client-side apps." },
      { name: "Ethereum Basics", fromLesson: 16, toLesson: 20, focus: "The EVM, wallet adapters, liquidity and key management." },
      { name: "Solidity & EVM Contracts", fromLesson: 21, toLesson: 32, focus: "Writing, testing, bridging and upgrading contracts." },
      { name: "Rust", fromLesson: 33, toLesson: 38, focus: "The language Solana programs are written in." },
      { name: "Solana Programs", fromLesson: 39, toLesson: 48, focus: "Native contracts, CPIs, PDAs, and Anchor." },
      { name: "Wallets & Wrap-up", fromLesson: 49, toLesson: 52, focus: "Key management, a cloud wallet, and a bot." },
      { name: "Crypto Products", fromLesson: 53, toLesson: 56, focus: "An exchange and a payment gateway, end to end." },
    ],
  },
];

export function getTrack(id: TrackId): Track {
  const t = TRACKS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown track: ${id}`);
  return t;
}

/** Two days per lecture. */
export function trackDays(track: Track): number {
  return track.lessons.length * 2;
}

export interface RoadmapTask {
  kind: Phase;
  /** Title as stored on the todo. */
  title: string;
  priority: Priority;
}

export interface RoadmapDay {
  trackId: TrackId;
  /** 1-based, within the track. */
  day: number;
  /** YYYY-MM-DD */
  date: string;
  weekday: string;
  /** 1-based lecture number this day belongs to. */
  lessonNumber: number;
  lesson: Lesson;
  section: Section;
  phase: Phase;
  task: RoadmapTask;
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

function sectionFor(track: Track, lessonNumber: number): Section {
  return (
    track.sections.find(
      (s) => lessonNumber >= s.fromLesson && lessonNumber <= s.toLesson
    ) ?? track.sections[track.sections.length - 1]
  );
}

/**
 * The single task for a day. The "Web Dev · Day 12 ·" prefix is what marks a
 * todo as generated, so the sync can tell its own rows from ones you typed in
 * yourself, and tells the two tracks apart on a shared day.
 */
export function taskFor(
  track: Track,
  day: number,
  lesson: Lesson,
  phase: Phase
): RoadmapTask {
  const prefix = `${track.name} · Day ${day} · `;
  return phase === "watch"
    ? {
        kind: "watch",
        title: `${prefix}Watch — ${lesson.title} (${lesson.duration})`,
        priority: "High",
      }
    : {
        kind: "build",
        title: `${prefix}Build — implement what you learned from ${lesson.title}`,
        priority: "High",
      };
}

/** Builds one track's days. Pure — same output every time. */
export function buildTrack(id: TrackId): RoadmapDay[] {
  const track = getTrack(id);
  const days: RoadmapDay[] = [];

  for (let i = 0; i < trackDays(track); i++) {
    const day = i + 1;
    const lessonIndex = Math.floor(i / 2);
    const phase: Phase = i % 2 === 0 ? "watch" : "build";
    const lesson = track.lessons[lessonIndex];
    const date = addDays(ROADMAP_START, i);

    days.push({
      trackId: track.id,
      day,
      date,
      weekday: WEEKDAYS[new Date(`${date}T00:00:00.000Z`).getUTCDay()],
      lessonNumber: lessonIndex + 1,
      lesson,
      section: sectionFor(track, lessonIndex + 1),
      phase,
      task: taskFor(track, day, lesson, phase),
    });
  }

  return days;
}

/** Every day of every track, in one list. */
export function buildRoadmap(): RoadmapDay[] {
  return TRACKS.flatMap((t) => buildTrack(t.id));
}

/** The instant stored on a todo for a given calendar day. */
export function todoTimestamp(date: string): string {
  return calendarDay(date).toISOString();
}

/** Total runtime of a track's lectures, as "Xh Ym". */
export function totalRuntime(track: Track): string {
  let seconds = 0;
  for (const l of track.lessons) {
    const parts = l.duration.split(":").map(Number);
    while (parts.length < 3) parts.unshift(0);
    seconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const h = Math.floor(seconds / 3600);
  return `${h}h ${Math.round((seconds % 3600) / 60)}m`;
}

/** Last date covered by any track. */
export function roadmapEnd(): string {
  return buildRoadmap()
    .map((d) => d.date)
    .sort()
    .slice(-1)[0];
}
