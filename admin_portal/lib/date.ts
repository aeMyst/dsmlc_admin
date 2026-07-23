export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;

  const [, yearStr, monthStr, dayStr] = match;
  const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), 12));

  return date.toLocaleDateString(undefined, { ...options, timeZone: "UTC" });
}

export function formatMonthYear(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})/);
  if (!match) return value;

  const [, yearStr, monthStr] = match;
  const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, 1, 12));

  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit", timeZone: "UTC" });
}