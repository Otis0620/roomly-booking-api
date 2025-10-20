/**
 * Interface defining a JWT (JSON Web Token) manager.
 *
 * Provides methods for signing, verifying, and decoding JWTs.
 * Implementations typically wrap libraries like `jsonwebtoken`.
 */
export interface IJwtManager {
  /**
   * Signs a payload into a JWT string using the given secret and options.
   *
   * @template T
   * @param {T} payload - The payload to sign.
   * @param {string} secret - The secret key used to sign the token.
   * @param {IJwtSignOptions} [options] - Optional JWT signing options.
   * @returns {string} The signed JWT string.
   */
  sign<T extends object>(payload: T, secret: string, options?: IJwtSignOptions): string;

  /**
   * Verifies a JWT and returns the decoded payload.
   *
   * @template T
   * @param {string} token - The JWT to verify.
   * @param {string} secret - The secret key used to verify the token.
   * @returns {T} The decoded and verified payload.
   * @throws {Error} If the token is invalid or verification fails.
   */
  verify<T>(token: string, secret: string): T;

  /**
   * Decodes a JWT without verifying its signature.
   *
   * @template T
   * @param {string} token - The JWT to decode.
   * @returns {T | null} The decoded payload if successful, or `null` if decoding fails.
   */
  decode<T = unknown>(token: string): T | null;
}

/**
 * Options used when signing a JWT.
 *
 * These options allow controlling token metadata such as expiration,
 * audience, issuer, and subject.
 */
export interface IJwtSignOptions {
  /**
   * Time span until the token expires (e.g., `'1h'`, `'7d'`, or milliseconds).
   */
  expiresIn?: string | number;

  /**
   * Identifies the intended audience of the token.
   */
  audience?: string;

  /**
   * Identifies the principal that issued the token.
   */
  issuer?: string;

  /**
   * Identifies the subject of the token.
   */
  subject?: string;

  /**
   * Allows additional custom signing options.
   */
  [key: string]: unknown;
}
