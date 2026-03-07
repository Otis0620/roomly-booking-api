/**
 * Dependency injection identifiers.
 *
 * Each symbol uniquely identifies a dependency in the InversifyJS container.
 * Using symbols prevents naming collisions and enables type-safe injection.
 */
export const IDENTIFIERS = {
  DataSource: Symbol.for('DataSource'),

  UserRepository: Symbol.for('UserRepository'),
  HotelRepository: Symbol.for('HotelRepository'),

  AuthService: Symbol.for('AuthService'),
  HotelService: Symbol.for('HotelService'),

  CryptoManager: Symbol.for('CryptoManager'),
  JwtManager: Symbol.for('JwtManager'),

  AuthController: Symbol.for('AuthController'),
  HotelController: Symbol.for('HotelController'),
} as const;
