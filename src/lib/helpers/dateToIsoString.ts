/**
 * Converts a `Date` object or string to an ISO 8601 formatted string.
 *
 * @param {Date | string} date - The date object or string to convert.
 * @returns {string} The ISO 8601 string or `"Invalid Date"` if the date is invalid.
 */
export function dateToIsoString(date: Date | string): string {
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString();
  }

  return String(date);
}
