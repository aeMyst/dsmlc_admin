/**
 * Formats a date value (either a plain "YYYY-MM-DD" date or a Postgres
 * timestamptz string like "2026-07-22 22:20:40.565336+00") as a calendar
 * date, without letting the browser's local timezone shift the day.
 *
 * Why this matters: `new Date("2026-07-22")` is parsed as UTC midnight.
 * `.toLocaleDateString()` then converts that instant into the browser's
 * local timezone before formatting — for anyone west of UTC (e.g. Calgary,
 * UTC-6/-7), that rolls the displayed date back to the previous day, and
 * the drift gets worse once a real time-of-day is attached (timestamptz).
 * Pulling the Y/M/D straight out of the string and formatting in UTC
 * sidesteps this entirely: the calendar date an event happens on shouldn't
 * move depending on who's viewing the page.
 */
export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;

  const [, yearStr, monthStr, dayStr] = match;
  // Anchor at UTC noon (not midnight) as extra insurance against any
  // remaining timezone math nudging it into an adjacent day, then format
  // with timeZone: "UTC" so the formatter itself can't shift it either.
  const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), 12));

  return date.toLocaleDateString(undefined, { ...options, timeZone: "UTC" });
}

/** Same idea, for "YYYY-MM" bucket keys (e.g. member growth chart months). */
export function formatMonthYear(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})/);
  if (!match) return value;

  const [, yearStr, monthStr] = match;
  const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, 1, 12));

  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit", timeZone: "UTC" });
}