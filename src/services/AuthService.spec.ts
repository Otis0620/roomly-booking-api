import 'reflect-metadata';

import { Container } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { User } from '@entities';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { ICryptoManager } from '@lib/cyrpto/ICryptoManager';
import { UserRole } from '@lib/types';

import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let cryptoManagerMock: jest.Mocked<ICryptoManager>;
  let container: Container;

  beforeEach(() => {
    jest.restoreAllMocks();

    container = new Container();

    userRepositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    cryptoManagerMock = {
      hash: jest.fn(),
      genSalt: jest.fn(),
      compare: jest.fn(),
    };

    container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
    container
      .bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository)
      .toConstantValue(userRepositoryMock);
    container
      .bind<ICryptoManager>(DEPENDENCY_IDENTIFIERS.ICryptoManager)
      .toConstantValue(cryptoManagerMock);

    authService = container.get<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const email = 'test@example.com';
    const password = 'mypassword';
    const role = UserRole.GUEST;

    const user: User = {
      id: 'u1',
      email,
      password_hash: 'mocked_hash',
      role,
      created_at: new Date(),
    };

    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.create.mockResolvedValueOnce(user);
    cryptoManagerMock.hash.mockResolvedValueOnce(password);

    const result = await authService.register(email, password, role);

    expect(cryptoManagerMock.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toMatchObject<UserDTO>({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at.toISOString(),
    });
  });

  it('should throw BadRequestError if user exists', async () => {
    const email = 'test@example.com';
    const password = 'mypassword';
    const role = UserRole.GUEST;

    userRepositoryMock.findByEmail.mockResolvedValue({
      id: 'u2',
      email,
      password_hash: 'mocked_hash',
      role,
      created_at: new Date(),
    });

    await expect(authService.register(email, password, role)).rejects.toThrow(BadRequestError);
  });
});
