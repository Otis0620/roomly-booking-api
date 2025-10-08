import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { IUserRepository, UserRepository } from '@repositories';
import { AuthService, HotelService } from '@services';

import { AuthController, HotelController } from '@controllers/v1';
import { AppDataSource } from '@infra/db';
import { ICryptoManager, BcryptManager } from '@lib/crypto';
import { IJwtManager, JwtManager } from '@lib/jwt';

import { DEPENDENCY_IDENTIFIERS } from './dependencyIdentifiers';

export type CreateAppContainerOptions = {
  dataSource?: DataSource;
};

/**
 * Creates and configures a new InversifyJS dependency injection container.
 *
 * Binds all core application dependencies including repositories, services, controllers,
 * and utilities such as cryptography and JWT managers. The container is configured to use
 * transient scope by default.
 *
 * @param {CreateAppContainerOptions} [options] - Optional configuration overrides.
 * @param {DataSource} [options.dataSource] - A custom TypeORM data source instance (used primarily for testing).
 * @returns {Container} A configured InversifyJS container with all dependencies registered.
 */
export function createAppContainer(options: CreateAppContainerOptions = {}) {
  const container = new Container({ defaultScope: 'Transient' });

  const dataSource = options.dataSource ?? AppDataSource;

  container.bind<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource).toConstantValue(dataSource);
  container.bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository).to(UserRepository);
  container.bind<ICryptoManager>(DEPENDENCY_IDENTIFIERS.ICryptoManager).to(BcryptManager);
  container.bind<IJwtManager>(DEPENDENCY_IDENTIFIERS.IJwtManager).to(JwtManager);

  container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
  container.bind<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController).to(AuthController);

  container.bind<HotelService>(DEPENDENCY_IDENTIFIERS.HotelService).to(HotelService);
  container.bind<HotelController>(DEPENDENCY_IDENTIFIERS.HotelController).to(HotelController);

  return container;
}

let appContainer: Container | null = null;

/**
 * Retrieves the global InversifyJS dependency injection container instance.
 *
 * Initializes the container using {@link createAppContainer} on first access and
 * reuses the same instance for subsequent calls. Ensures a single application-wide
 * container is shared across modules.
 *
 * @returns {Container} The singleton InversifyJS container instance.
 */
export function getAppContainer() {
  if (!appContainer) {
    appContainer = createAppContainer();
  }

  return appContainer;
}
