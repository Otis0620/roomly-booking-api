import { injectable, unmanaged } from 'inversify';
import * as JwtProvider from 'jsonwebtoken';

import { IJwtManager, IJwtSignOptions } from './IJwtManager';

/**
 * Implementation of {@link IJwtManager} using the `jsonwebtoken` library.
 *
 * Provides methods to sign, verify, and decode JSON Web Tokens (JWT).
 * Uses dependency injection to allow the JWT provider to be replaced,
 * which is useful for testing or custom implementations.
 */
@injectable()
export class JwtManager implements IJwtManager {
  /**
   * Creates a new `JwtManager` instance.
   *
   * @param {typeof JwtProvider} [jwtProvider=JwtProvider] - The JWT provider to use.
   * Defaults to the `jsonwebtoken` library.
   */
  constructor(@unmanaged() private readonly jwtProvider = JwtProvider) {}

  /**
   * Signs a payload into a JWT string using the given secret and options.
   *
   * @template T
   * @param {T} payload - The payload to sign.
   * @param {string} secret - The secret key used to sign the token.
   * @param {IJwtSignOptions} [options] - Optional JWT signing options.
   * @returns {string} The signed JWT string.
   */
  sign<T extends object>(payload: T, secret: string, options?: IJwtSignOptions): string {
    return this.jwtProvider.sign(payload, secret, options);
  }

  /**
   * Verifies a JWT and returns the decoded payload.
   *
   * @template T
   * @param {string} token - The JWT to verify.
   * @param {string} secret - The secret key used to verify the token.
   * @returns {T} The decoded and verified payload.
   */
  verify<T>(token: string, secret: string): T {
    return this.jwtProvider.verify(token, secret) as T;
  }

  /**
   * Decodes a JWT without verifying its signature.
   *
   * @template T
   * @param {string} token - The JWT to decode.
   * @returns {T | null} The decoded payload if successful, or `null` if decoding fails.
   */
  decode<T = unknown>(token: string): T | null {
    return this.jwtProvider.decode(token) as T | null;
  }
}
