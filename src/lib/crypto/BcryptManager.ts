import * as bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';

import { IDENTIFIERS } from '@infra/di/identifiers';

@injectable()
export class BcryptManager {
  /**
   * @param saltRounds - Cost factor for bcrypt hashing. Determines the number
   *   of iterations as 2^saltRounds (e.g. 10 = 1,024 iterations). Higher
   *   values are more secure but slower to compute.
   */
  constructor(@inject(IDENTIFIERS.BcryptSaltRounds) private saltRounds: number) {}

  /**
   * Hashes a plain text password.
   *
   * @param data - Plain text password to hash
   * @returns Bcrypt hash of the password
   */
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  /**
   * Compares a plain text password against a hash.
   *
   * @param data - Plain text password to verify
   * @param encrypted - Bcrypt hash to compare against
   * @returns True if password matches, false otherwise
   */
  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
