import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { AuthController } from '@controllers/AuthController';
import { AppDataSource } from '@infra/database/dataSource';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { JwtManager } from '@lib/jwt/JwtManager';
import { IUserRepository, UserRepository } from '@repositories/UserRepository';
import { AuthService } from '@services/AuthService';

export interface ContainerOptions {
  dataSource?: DataSource;
}

/**
 * Creates a fully configured DI container.
 *
 * Call this ONCE at application startup. The container is the composition root
 * where all dependencies are wired together.
 *
 * @param options - Optional overrides (primarily for testing)
 * @returns Configured InversifyJS container
 *
 * @example
 * // Production
 * const container = createContainer();
 *
 * @example
 * // Testing with mock database
 * const container = createContainer({ dataSource: mockDataSource });
 */
export function createContainer(options: ContainerOptions = {}): Container {
  const container = new Container({ defaultScope: 'Transient' });

  const dataSource = options.dataSource ?? AppDataSource;

  container.bind<DataSource>(IDENTIFIERS.DataSource).toConstantValue(dataSource);

  container.bind<BcryptManager>(IDENTIFIERS.CryptoManager).to(BcryptManager).inSingletonScope();
  container.bind<JwtManager>(IDENTIFIERS.JwtManager).to(JwtManager).inSingletonScope();

  container.bind<IUserRepository>(IDENTIFIERS.UserRepository).to(UserRepository);

  container.bind<AuthService>(IDENTIFIERS.AuthService).to(AuthService);

  container.bind<AuthController>(IDENTIFIERS.AuthController).to(AuthController);

  return container;
}
