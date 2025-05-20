import 'reflect-metadata';
import { Container } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { User } from '@entities';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { ICryptoManager } from '@lib/cyrpto/ICryptoManager';
import { IJwtManager } from '@lib/jwt';
import { UserRole } from '@lib/types';

import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let cryptoManagerMock: jest.Mocked<ICryptoManager>;
  let jwtManagerMock: jest.Mocked<IJwtManager>;
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

    jwtManagerMock = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    };

    container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
    container
      .bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository)
      .toConstantValue(userRepositoryMock);
    container
      .bind<ICryptoManager>(DEPENDENCY_IDENTIFIERS.ICryptoManager)
      .toConstantValue(cryptoManagerMock);
    container.bind<IJwtManager>(DEPENDENCY_IDENTIFIERS.IJwtManager).toConstantValue(jwtManagerMock);

    authService = container.get<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
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

  describe('login', () => {
    it('should login a user and return user DTO and JWT token', async () => {
      const email = 'test@example.com';
      const password = 'correct-password';
      const role = UserRole.GUEST;

      const user: User = {
        id: 'u1',
        email,
        password_hash: 'hashed-password',
        role,
        created_at: new Date(),
      };

      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      cryptoManagerMock.compare.mockResolvedValueOnce(true);

      jwtManagerMock.sign.mockReturnValue('mocked-jwt-token');

      const result = await authService.login(email, password);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
      expect(cryptoManagerMock.compare).toHaveBeenCalledWith(password, user.password_hash);
      expect(jwtManagerMock.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      expect(result?.user).toMatchObject<UserDTO>({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at.toISOString(),
      });

      expect(result?.token).toBe('mocked-jwt-token');
    });

    it('should return null if user is not found during login', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(null);

      const result = await authService.login('nonexistent@example.com', 'any-password');

      expect(result).toBeNull();
      expect(cryptoManagerMock.compare).not.toHaveBeenCalled();
    });

    it('should return null if password is incorrect', async () => {
      const user: User = {
        id: 'u1',
        email: 'test@example.com',
        password_hash: 'hashed-password',
        role: UserRole.GUEST,
        created_at: new Date(),
      };

      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      cryptoManagerMock.compare.mockResolvedValueOnce(false);

      const result = await authService.login(user.email, 'wrong-password');

      expect(result).toBeNull();
      expect(cryptoManagerMock.compare).toHaveBeenCalledWith('wrong-password', user.password_hash);
    });
  });
});
