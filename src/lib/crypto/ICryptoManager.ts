/**
 * Interface defining a cryptographic manager.
 *
 * Provides methods for hashing data, generating salts,
 * and verifying plaintext against hashed values.
 */
export interface ICryptoManager {
  /**
   * Generates a cryptographic hash from the given data.
   *
   * @param {string} data - The plaintext data to hash.
   * @param {number} saltRounds - Number of salt rounds to use for hashing.
   * @returns {Promise<string>} A promise that resolves to the resulting hash.
   */
  hash(data: string, saltRounds: number): Promise<string>;

  /**
   * Generates a cryptographic salt.
   *
   * @param {number} rounds - Number of rounds to use for salt generation.
   * @returns {Promise<string>} A promise that resolves to the generated salt.
   */
  genSalt(rounds: number): Promise<string>;

  /**
   * Compares plaintext data with a hashed value to verify a match.
   *
   * @param {string} data - The plaintext data to compare.
   * @param {string} encrypted - The previously hashed value.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the data matches the hash, otherwise `false`.
   */
  compare(data: string, encrypted: string): Promise<boolean>;
}
