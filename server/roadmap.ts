import { db } from "./db";
import { goals, todos, users } from "../shared/schema";
import {
  TRACKS,
  buildTrack,
  todoTimestamp,
  trackDays,
  getTrack,
  type Track,
  type TrackId,
} from "../shared/roadmap";
import { and, eq, inArray } from "drizzle-orm";

/**
 * Generated tasks open with "Web Dev · Day 12 · ". Older forms are matched too
 * so plans written by earlier versions can still be cleaned up. A task typed in
 * by hand won't look like any of them.
 */
const SCHEDULED =
  /^([A-Za-z0-9 ]+ · Day \d{1,3} · |Day \d{1,3} · |\d{1,2}:\d{2}(am|pm)?–\d{1,2}:\d{2}(am|pm)? · )/;

/** Finds a track's goal, creating it on first sync. */
async function findGoal(userId: string, track: Track) {
  const [existing] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.title, track.goalTitle)));
  return existing;
}

async function ensureGoal(userId: string, track: Track) {
  const existing = await findGoal(userId, track);
  if (existing) return existing;

  const days = buildTrack(track.id);
  const [created] = await db
    .insert(goals)
    .values({
      userId,
      title: track.goalTitle,
      description: track.goalDescription,
      targetDate: new Date(todoTimestamp(days[days.length - 1].date)),
      progress: 0,
    })
    .returning();
  return created;
}

export interface TrackStatus {
  trackId: TrackId;
  name: string;
  goalId: number | null;
  syncedTasks: number;
  totalTasks: number;
  completedTasks: number;
}

/** How much of each track has made it into the task list. */
export async function getRoadmapStatus(userId: string) {
  const tracks: TrackStatus[] = [];

  for (const track of TRACKS) {
    const totalTasks = trackDays(track);
    const goal = await findGoal(userId, track);

    if (!goal) {
      tracks.push({
        trackId: track.id,
        name: track.name,
        goalId: null,
        syncedTasks: 0,
        totalTasks,
        completedTasks: 0,
      });
      continue;
    }

    const linked = await db
      .select()
      .from(todos)
      .where(and(eq(todos.userId, userId), eq(todos.goalId, goal.id)));

    tracks.push({
      trackId: track.id,
      name: track.name,
      goalId: goal.id,
      syncedTasks: linked.length,
      totalTasks,
      completedTasks: linked.filter((t) => t.isCompleted).length,
    });
  }

  return { tracks };
}

const keyOf = (date: Date | null, title: string) =>
  `${date ? new Date(date).toISOString().slice(0, 10) : "none"}|${title}`;

/**
 * Adds both tracks to the task list. A task is inserted only when no todo with
 * the same title already sits on that date under the track's goal, so
 * re-running never duplicates.
 *
 * Deleting is opt-in. `prune` drops generated tasks that are no longer in the
 * plan, which is right for a one-off cleanup from the command line but wrong
 * for a button: a task reworded by hand looks exactly like a task that left the
 * plan, and losing someone's edit is worse than leaving a stale row behind.
 */
export async function syncRoadmap(userId: string, { prune = false } = {}) {
  // todos.user_id is a foreign key onto users, and the app runs single-user.
  await db.insert(users).values({ id: userId }).onConflictDoNothing();

  let inserted = 0;
  let removed = 0;
  let skipped = 0;
  const goalIds: number[] = [];

  for (const track of TRACKS) {
    const goal = await ensureGoal(userId, getTrack(track.id));
    goalIds.push(goal.id);

    const days = buildTrack(track.id);
    const existing = await db
      .select()
      .from(todos)
      .where(and(eq(todos.userId, userId), eq(todos.goalId, goal.id)));

    const seen = new Set(existing.map((t) => keyOf(t.date, t.title)));
    const wanted = new Set(days.map((d) => `${d.date}|${d.task.title}`));

    if (prune) {
      const stale = existing
        .filter((t) => SCHEDULED.test(t.title) && !wanted.has(keyOf(t.date, t.title)))
        .map((t) => t.id);
      for (let i = 0; i < stale.length; i += 200) {
        await db.delete(todos).where(inArray(todos.id, stale.slice(i, i + 200)));
      }
      removed += stale.length;
    }

    const rows = days
      .filter((d) => !seen.has(`${d.date}|${d.task.title}`))
      .map((d) => ({
        userId,
        goalId: goal.id,
        title: d.task.title,
        date: new Date(todoTimestamp(d.date)),
        priority: d.task.priority,
        isCompleted: false,
      }));

    for (let i = 0; i < rows.length; i += 200) {
      await db.insert(todos).values(rows.slice(i, i + 200));
    }

    inserted += rows.length;
    skipped += days.length - rows.length;
  }

  return { goalIds, inserted, removed, skipped, totalTasks: inserted + skipped };
}
