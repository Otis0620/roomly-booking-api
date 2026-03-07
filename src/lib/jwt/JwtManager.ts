import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

/**
 * JWT token payload structure.
 */
export interface JwtPayload {
  sub: string;
  role: string;
  [key: string]: unknown;
}

/**
 * JWT token utility.
 */
@injectable()
export class JwtManager {
  /**
   * Signs a payload into a JWT token.
   *
   * @param payload - Data to encode in the token
   * @param secret - Secret key for signing
   * @param options - Signing options
   * @returns Signed JWT token string
   */
  sign(payload: JwtPayload, secret: string, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secret, options);
  }

  /**
   * Verifies a JWT token and returns the payload.
   *
   * @param token - JWT token to verify
   * @param secret - Secret key used for signing
   * @returns Decoded payload
   */
  verify<T = JwtPayload>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }

  /**
   * Decodes a JWT token without verifying the signature.
   *
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   */
  decode<T = JwtPayload>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
