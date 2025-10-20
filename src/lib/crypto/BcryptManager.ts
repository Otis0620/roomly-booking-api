import * as bcrypt from 'bcrypt';
import { injectable, unmanaged } from 'inversify';

import { ICryptoManager } from './ICryptoManager';
import { ICryptoProvider } from './ICryptoProvider';

/**
 * Implementation of {@link ICryptoManager} using the `bcrypt` library.
 *
 * This class provides methods for hashing data, generating salts, and comparing
 * plaintext input against hashed values. It uses dependency injection to allow
 * the crypto provider to be overridden (useful for testing or alternative implementations).
 */
@injectable()
export class BcryptManager implements ICryptoManager {
  /**
   * Creates a new `BcryptManager` instance.
   *
   * @param {ICryptoProvider} [cryptoProvider=bcrypt] - The crypto provider to use.
   * Defaults to the `bcrypt` library.
   */
  constructor(@unmanaged() private readonly cryptoProvider: ICryptoProvider = bcrypt) {}

  /**
   * Generates a bcrypt hash of the given data.
   *
   * @param {string} data - The plaintext data to hash.
   * @param {number} saltRounds - Number of salt rounds to use in hashing.
   * @returns {Promise<string>} A promise that resolves to the hashed value.
   */
  hash(data: string, saltRounds: number): Promise<string> {
    return this.cryptoProvider.hash(data, saltRounds);
  }

  /**
   * Generates a salt for use in hashing.
   *
   * @param {number} rounds - Number of rounds to use in salt generation.
   * @returns {Promise<string>} A promise that resolves to the generated salt.
   */
  genSalt(rounds: number): Promise<string> {
    return this.cryptoProvider.genSalt(rounds);
  }

  /**
   * Compares plaintext data to an encrypted hash.
   *
   * @param {string} data - The plaintext data to compare.
   * @param {string} encrypted - The previously hashed value.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the data matches the hash, otherwise `false`.
   */
  compare(data: string, encrypted: string): Promise<boolean> {
    return this.cryptoProvider.compare(data, encrypted);
  }
}
