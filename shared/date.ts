/**
 * Calendar days, not instants.
 *
 * A task belongs to a day on a wall calendar — it has no time zone. Storing
 * one as an instant is what made a task added on the 17th show up on the 16th:
 * the browser sent local midnight ("2026-08-17T00:00:00+05:30" = 18:30Z on the
 * 16th) and the server, running in UTC, filed it under the 16th.
 *
 * So: the client sends a plain YYYY-MM-DD, and the server anchors it at noon
 * UTC. Noon is far enough from both edges that the day never shifts, whatever
 * time zone the server or the reader is in.
 */

export const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** The instant stored for a calendar day: noon UTC. */
export function calendarDay(value: string | Date): Date {
  if (typeof value === "string" && DAY_KEY.test(value)) {
    return new Date(`${value}T12:00:00.000Z`);
  }

  // Anything else is an instant. Read its UTC date parts and re-anchor, which
  // keeps values already written at noon UTC exactly where they are.
  const d = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12));
}

/** YYYY-MM-DD for a stored calendar day. */
export function dayKey(value: string | Date): string {
  if (typeof value === "string" && DAY_KEY.test(value)) return value;
  return calendarDay(value).toISOString().slice(0, 10);
}

/** The window a day's tasks live in — always UTC, never the server's zone. */
export function dayBounds(day: string): { start: Date; end: Date } {
  const key = dayKey(day);
  return {
    start: new Date(`${key}T00:00:00.000Z`),
    end: new Date(`${key}T23:59:59.999Z`),
  };
}
