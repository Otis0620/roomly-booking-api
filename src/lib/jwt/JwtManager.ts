import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';

import { IDENTIFIERS } from '@infra/di/identifiers';

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
   * Creates a new JwtManager instance.
   *
   * @param jwtSecret - Secret key for signing and verifying tokens
   * @param jwtExpiresIn - Token expiration duration (e.g. '1h', '7d')
   */
  constructor(
    @inject(IDENTIFIERS.JwtSecret) private jwtSecret: string,
    @inject(IDENTIFIERS.JwtExpiresIn) private jwtExpiresIn: string,
  ) {}

  /**
   * Signs a payload into a JWT token.
   *
   * @param payload - Data to encode in the token
   * @returns Signed JWT token string
   */
  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verifies a JWT token and returns the payload.
   *
   * @param token - JWT token to verify
   * @returns Decoded payload
   */
  verify<T = JwtPayload>(token: string): T {
    return jwt.verify(token, this.jwtSecret) as T;
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
