/**
 * Seeds the 79-day web dev roadmap into the database.
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
import { buildRoadmap, ROADMAP_START, totalRuntime } from "../shared/roadmap";

const USER_ID = "bansi";
const dryRun = process.argv.includes("--dry-run");

function summarise() {
  const plan = buildRoadmap();
  const tasks = plan.reduce((n, d) => n + d.tasks.length, 0);

  console.log(
    `Plan: ${plan.length} days, ${plan[0].date} → ${plan[plan.length - 1].date}, ` +
      `${tasks} tasks, ${totalRuntime()} of video.`
  );

  for (const day of [plan[0], plan[1], plan[plan.length - 1]]) {
    console.log(`\n── Day ${day.day} · ${day.weekday} ${day.date} · ${day.section.name}`);
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
