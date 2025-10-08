/**
 * Collection of unique dependency identifiers used by the InversifyJS container.
 *
 * Each key maps to a `Symbol` that uniquely identifies a service, repository, or controller
 * within the dependency injection system. These identifiers ensure consistent and type-safe
 * bindings across the application.
 *
 * @constant
 * @type {Record<string, symbol>}
 *
 * @property {symbol} DataSource - Identifier for the TypeORM data source.
 * @property {symbol} IUserRepository - Identifier for the user repository interface.
 * @property {symbol} ICryptoManager - Identifier for the cryptography manager.
 * @property {symbol} IJwtManager - Identifier for the JWT manager.
 * @property {symbol} AuthService - Identifier for the authentication service.
 * @property {symbol} AuthController - Identifier for the authentication controller.
 * @property {symbol} HotelController - Identifier for the hotel controller.
 * @property {symbol} HotelService - Identifier for the hotel service.
 */
export const DEPENDENCY_IDENTIFIERS = {
  DataSource: Symbol.for('DataSource'),
  IUserRepository: Symbol.for('IUserRepository'),
  ICryptoManager: Symbol.for('ICryptoManager'),
  IJwtManager: Symbol.for('IJwtManager'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
  HotelController: Symbol.for('HotelController'),
  HotelService: Symbol.for('HotelService'),
};
