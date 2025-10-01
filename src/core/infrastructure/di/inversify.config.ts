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

let _appContainer: Container | null = null;

export function getAppContainer() {
  if (!_appContainer) _appContainer = createAppContainer();

  return _appContainer;
}
