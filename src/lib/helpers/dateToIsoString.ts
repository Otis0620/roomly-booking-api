export function dateToIsoString(date: Date | string): string {
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString();
  }

  return String(date);
}
