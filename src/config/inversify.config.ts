import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { IUserRepository, UserRepository } from '@repositories';
import { AuthService } from '@services';

import { AuthController } from '@controllers/v1';
import { BcryptManager, ICryptoManager } from '@lib/crypto';

import { DEPENDENCY_IDENTIFIERS } from './dependencyIdentifiers';
import { AppDataSource } from './typeorm.config';

const container = new Container();

container.bind<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource).toConstantValue(AppDataSource);
container.bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository).to(UserRepository);
container.bind<ICryptoManager>(DEPENDENCY_IDENTIFIERS.ICryptoManager).to(BcryptManager);
container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
container.bind<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController).to(AuthController);

export { container };
