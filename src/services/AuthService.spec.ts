import 'reflect-metadata';
import { Container } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { User } from '@entities';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { UserRole } from '@lib/types';

import { AuthService } from './AuthService';

const mockBcryptHash = jest.fn<Promise<string>, [string, number]>();
const mockBcryptCompare = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('bcrypt', () => ({
  hash: (password: string, saltRounds: number) => mockBcryptHash(password, saltRounds),
  compare: (data: string, encrypted: string) => mockBcryptCompare(data, encrypted),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let container: Container;

  beforeEach(() => {
    container = new Container();

    userRepositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    container.bind<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService).to(AuthService);
    container
      .bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository)
      .toConstantValue(userRepositoryMock);

    authService = container.get<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      mockBcryptHash.mockReset();
      mockBcryptCompare.mockReset();
    });

    it('should successfully register a new user', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'securepassword';
      const role = UserRole.GUEST;

      const hashedPassword = 'hashed_password';
      const newUser: User = {
        id: '123',
        email,
        password_hash: hashedPassword,
        role,
        created_at: new Date(),
      };

      mockBcryptHash.mockResolvedValue(hashedPassword);
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      userRepositoryMock.create.mockResolvedValue(newUser);

      // Act
      const result = await authService.register(email, password, role);

      // Assert
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
      expect(mockBcryptHash).toHaveBeenCalledWith(password, 10);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        email,
        password_hash: hashedPassword,
        role,
      });

      expect(result).toMatchObject<UserDTO>({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at.toISOString(),
      });
    });

    it('should throw BadRequestError if email is already registered', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'securepassword';
      const role = UserRole.GUEST;

      const existingUser: User = {
        id: '123',
        email,
        password_hash: 'hashed_password',
        role,
        created_at: new Date(),
      };

      userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(authService.register(email, password, role)).rejects.toThrow(BadRequestError);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
