/**
 * Clears the old plan so a new one can take its place.
 *
 *   npx tsx script/reset-plan.mts            # show what would go
 *   npx tsx script/reset-plan.mts --confirm  # delete it
 *
 * Deletes every todo and every goal for the user. Diary entries are never
 * touched. This cannot be undone, so it does nothing without --confirm.
 */
import "dotenv/config";
import { db, pool } from "../server/db";
import { goals, todos, diaryEntries } from "../shared/schema";
import { eq } from "drizzle-orm";

const USER_ID = "bansi";
const confirmed = process.argv.includes("--confirm");

async function main() {
  const existingGoals = await db.select().from(goals).where(eq(goals.userId, USER_ID));
  const existingTodos = await db.select().from(todos).where(eq(todos.userId, USER_ID));
  const entries = await db.select().from(diaryEntries).where(eq(diaryEntries.userId, USER_ID));

  console.log(`Goals to delete:   ${existingGoals.length}`);
  for (const g of existingGoals) console.log(`  #${g.id} ${g.title}`);
  console.log(`Todos to delete:   ${existingTodos.length}`);
  console.log(`Diary entries:     ${entries.length} (untouched)`);

  if (!confirmed) {
    console.log("\nNothing deleted. Re-run with --confirm to go ahead.");
  } else {
    // Todos reference goals, so they go first.
    await db.delete(todos).where(eq(todos.userId, USER_ID));
    await db.delete(goals).where(eq(goals.userId, USER_ID));
    console.log(`\nDeleted ${existingTodos.length} todos and ${existingGoals.length} goals.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
