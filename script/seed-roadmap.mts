/**
 * Seeds the Web Dev and Web 3 roadmaps into the database.
 *
 *   npx tsx script/seed-roadmap.mts --dry-run   # print the plan, write nothing
 *   npx tsx script/seed-roadmap.mts             # create the goals + all tasks
 *   npx tsx script/seed-roadmap.mts --prune     # also drop tasks no longer in the plan
 *
 * Safe to re-run: tasks already present are left alone, and so is anything you
 * typed in yourself.
 */
import "dotenv/config";
import { pool } from "../server/db";
import { syncRoadmap } from "../server/roadmap";
import { TRACKS, buildTrack, trackDays, totalRuntime, ROADMAP_START } from "../shared/roadmap";

const USER_ID = "bansi";
const dryRun = process.argv.includes("--dry-run");

function summarise() {
  console.log(`Both tracks start ${ROADMAP_START}. One lecture, then a build day.\n`);

  for (const track of TRACKS) {
    const days = buildTrack(track.id);
    console.log(
      `${track.name}: ${track.lessons.length} lectures → ${trackDays(track)} days, ` +
        `${days[0].date} → ${days[days.length - 1].date}, ${totalRuntime(track)} of video`
    );
    for (const d of days.slice(0, 4)) {
      console.log(`   ${d.date}  ${d.task.title}`);
    }
    console.log(`   …\n   ${days[days.length - 1].date}  ${days[days.length - 1].task.title}\n`);
  }
}

async function main() {
  summarise();

  if (dryRun) {
    console.log("Dry run — nothing written.");
  } else {
    const result = await syncRoadmap(USER_ID, { prune: process.argv.includes("--prune") });
    console.log(
      `Goals ${result.goalIds.join(", ")} — ${result.inserted} added, ` +
        `${result.removed} removed, ${result.skipped} already present.`
    );
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
