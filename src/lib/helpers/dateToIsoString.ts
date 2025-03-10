export function dateToIsoString(date: Date | string): string {
  return date instanceof Date ? date.toISOString() : String(date);
}
