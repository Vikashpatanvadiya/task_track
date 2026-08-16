/**
 * Re-anchors existing todos onto the calendar day they were meant for.
 *
 *   npx tsx script/normalize-todo-dates.mts --dry-run
 *   npx tsx script/normalize-todo-dates.mts
 *
 * Tasks added before the calendar-day fix were stored as local-midnight
 * instants, so a task added on the 17th was written as 18:30 on the 16th and
 * showed up under the wrong day.
 *
 * todos.date is `timestamp without time zone`, so the work happens in SQL on
 * the stored value — reading it into a JS Date would shift it by whatever zone
 * this script happens to run in. Anything already at 12:00 is a calendar day
 * and is left alone; anything else is shifted into IST, the zone it was
 * written from, and re-anchored at noon on the day that lands on.
 */
import "dotenv/config";
import { pool } from "../server/db";

const dryRun = process.argv.includes("--dry-run");

const SELECT = `
  select id, title, date,
         date_trunc('day', date + interval '5 hours 30 minutes')
           + interval '12 hours' as corrected
  from todos
  where date is not null
    and date::time <> '12:00:00'
  order by id
`;

async function main() {
  const { rows } = await pool.query(SELECT);
  console.log(`${rows.length} todos to re-anchor.`);
  for (const r of rows.slice(0, 20)) {
    console.log(`  #${r.id} ${r.date.toISOString()} → ${r.corrected.toISOString()}  ${r.title.slice(0, 55)}`);
  }
  if (rows.length > 20) console.log(`  … and ${rows.length - 20} more`);

  if (dryRun) {
    console.log("\nDry run — nothing written.");
  } else if (rows.length) {
    const res = await pool.query(`
      update todos
         set date = date_trunc('day', date + interval '5 hours 30 minutes')
                      + interval '12 hours'
       where date is not null
         and date::time <> '12:00:00'
    `);
    console.log(`\nDone. ${res.rowCount} updated.`);
  } else {
    console.log("\nNothing to do.");
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
