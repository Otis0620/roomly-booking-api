import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { AuthController } from '@controllers/v1';

import { IUserRepository, UserRepository } from '@repositories';
import { AuthService } from '@services';

import { AppDataSource } from '../data-source';
import { DEPENDENCY_IDENTIFIERS } from './dependencyIdentifiers';

const container = new Container();

container.bind<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource).toConstantValue(AppDataSource);
container.bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository).to(UserRepository);
container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
container.bind<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController).to(AuthController);

export { container };
