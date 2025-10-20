/**
 * Represents an HTTP-related error.
 *
 * Extends the built-in `Error` interface to include an optional HTTP status code,
 * allowing errors to carry additional HTTP context.
 */
export interface HttpError extends Error {
  /**
   * Optional HTTP status code associated with the error.
   */
  status?: number;
}
