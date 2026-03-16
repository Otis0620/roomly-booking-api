/**
 * Dependency injection identifiers.
 *
 * Each symbol uniquely identifies a dependency in the InversifyJS container.
 * Using symbols prevents naming collisions and enables type-safe injection.
 */
export const IDENTIFIERS = {
  DataSource: Symbol.for('DataSource'),
  BcryptManager: Symbol.for('BcryptManager'),
  JwtManager: Symbol.for('JwtManager'),
  UserRepository: Symbol.for('UserRepository'),
  AuthController: Symbol.for('AuthController'),
  AuthService: Symbol.for('AuthService'),
  JwtSecret: Symbol.for('JwtSecret'),
  JwtExpiresIn: Symbol.for('JwtExpiresIn'),
  BcryptSaltRounds: Symbol.for('BcryptSaltRounds'),
} as const;
