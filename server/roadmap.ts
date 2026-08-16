import { db } from "./db";
import { goals, todos, users } from "../shared/schema";
import { buildRoadmap, todoTimestamp, ROADMAP_GOAL } from "../shared/roadmap";
import { and, eq, inArray } from "drizzle-orm";

/**
 * Generated tasks always open with a time range, e.g. "5:30am–6:30am · …".
 * The 24-hour form is matched too so plans written by older versions of this
 * file still get cleaned up. A task typed in by hand won't look like this.
 */
const SCHEDULED = /^\d{1,2}:\d{2}(am|pm)?–\d{1,2}:\d{2}(am|pm)? · /;

/** Finds the roadmap goal for a user, creating it on first sync. */
async function findGoal(userId: string) {
  const [existing] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.title, ROADMAP_GOAL.title)));
  return existing;
}

/** How much of the plan has made it into the task list. */
export async function getRoadmapStatus(userId: string) {
  const plan = buildRoadmap();
  const totalTasks = plan.reduce((n, day) => n + day.tasks.length, 0);
  const goal = await findGoal(userId);

  if (!goal) {
    return { goalId: null, syncedTasks: 0, totalTasks, completedTasks: 0 };
  }

  const linked = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.goalId, goal.id)));

  return {
    goalId: goal.id,
    syncedTasks: linked.length,
    totalTasks,
    completedTasks: linked.filter((t) => t.isCompleted).length,
  };
}

/**
 * Makes the task list mirror the plan. A task is inserted only when no todo
 * with the same title already sits on that date under the goal, so re-running
 * never duplicates. Scheduled tasks that have dropped out of the plan are
 * removed. Tasks added by hand carry no time prefix and are never touched.
 */
export async function syncRoadmap(userId: string) {
  const plan = buildRoadmap();
  const totalTasks = plan.reduce((n, day) => n + day.tasks.length, 0);

  // todos.user_id is a foreign key onto users, and the app runs single-user.
  await db.insert(users).values({ id: userId }).onConflictDoNothing();

  const goal =
    (await findGoal(userId)) ??
    (
      await db
        .insert(goals)
        .values({
          userId,
          title: ROADMAP_GOAL.title,
          description: ROADMAP_GOAL.description,
          targetDate: new Date(todoTimestamp(plan[plan.length - 1].date)),
          progress: 0,
        })
        .returning()
    )[0];

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.goalId, goal.id)));

  const keyOf = (date: Date | null, title: string) =>
    `${date ? new Date(date).toISOString().slice(0, 10) : "none"}|${title}`;

  const seen = new Set(existing.map((t) => keyOf(t.date, t.title)));
  const wanted = new Set(
    plan.flatMap((day) => day.tasks.map((task) => `${day.date}|${task.title}`))
  );

  const stale = existing
    .filter((t) => SCHEDULED.test(t.title) && !wanted.has(keyOf(t.date, t.title)))
    .map((t) => t.id);

  for (let i = 0; i < stale.length; i += 200) {
    await db.delete(todos).where(inArray(todos.id, stale.slice(i, i + 200)));
  }

  const rows = plan
    .flatMap((day) => day.tasks.map((task) => ({ date: day.date, task })))
    .filter(({ date, task }) => !seen.has(`${date}|${task.title}`))
    .map(({ date, task }) => ({
      userId,
      goalId: goal.id,
      title: task.title,
      date: new Date(todoTimestamp(date)),
      priority: task.priority,
      isCompleted: false,
    }));

  for (let i = 0; i < rows.length; i += 200) {
    await db.insert(todos).values(rows.slice(i, i + 200));
  }

  return {
    goalId: goal.id,
    inserted: rows.length,
    removed: stale.length,
    skipped: totalTasks - rows.length,
    totalTasks,
  };
}
