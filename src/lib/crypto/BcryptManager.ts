import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';

/**
 * Password hashing utility using bcrypt.
 */
@injectable()
export class BcryptManager {
  /**
   * Hashes a plain text password.
   *
   * @param data - Plain text password to hash
   * @param saltRounds - Number of salt rounds
   * @returns Bcrypt hash of the password
   */
  async hash(data: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(data, saltRounds);
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
