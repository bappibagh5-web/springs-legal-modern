/** Formats an ISO date (YYYY-MM-DD) as "October 15, 2026" without timezone drift. */
export function formatDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
