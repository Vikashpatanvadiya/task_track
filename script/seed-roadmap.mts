/**
 * Seeds the 100-day internship roadmap into the database.
 *
 *   npx tsx script/seed-roadmap.mts --dry-run   # print the plan, write nothing
 *   npx tsx script/seed-roadmap.mts             # create the goal + all tasks
 *   npx tsx script/seed-roadmap.mts --prune     # also drop tasks no longer in the plan
 *
 * Safe to re-run: it makes the task list mirror the plan. New tasks are added,
 * scheduled tasks that have left the plan are removed, and anything you typed
 * in yourself is left alone.
 */
import "dotenv/config";
import { pool } from "../server/db";
import { syncRoadmap } from "../server/roadmap";
import { buildRoadmap, ROADMAP_START } from "../shared/roadmap";

const USER_ID = "bansi";
const dryRun = process.argv.includes("--dry-run");

function summarise() {
  const plan = buildRoadmap();
  const hours: Record<string, number> = {};
  let tasks = 0;

  for (const day of plan) {
    tasks += day.tasks.length;
    for (const t of day.tasks) hours[t.kind] = (hours[t.kind] ?? 0) + t.hours;
  }

  console.log(`Plan: ${plan.length} days, ${plan[0].date} → ${plan[plan.length - 1].date}`);
  console.log(`Tasks: ${tasks}`);
  console.log(
    "Hours: " +
      Object.entries(hours)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")
  );

  for (const day of [plan[0], plan[2], plan[5], plan[6], plan[99]]) {
    console.log(`\n── Day ${day.day} · ${day.weekday} ${day.date} · week ${day.week} · ${day.theme}`);
    console.log(`   classes ${day.classHours} h → coding ${day.codingHours} h`);
    for (const t of day.tasks) console.log(`   ${t.priority.padEnd(6)} ${t.title}`);
  }
}

async function main() {
  summarise();

  if (dryRun) {
    console.log("\nDry run — nothing written.");
  } else {
    const result = await syncRoadmap(USER_ID, { prune: process.argv.includes("--prune") });
    console.log(
      `\nGoal #${result.goalId} — ${result.inserted} added, ${result.removed} removed, ` +
        `${result.skipped} already present. Plan starts ${ROADMAP_START}.`
    );
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
