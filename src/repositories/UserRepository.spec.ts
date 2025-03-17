import 'reflect-metadata';
import { Container } from 'inversify';
import { Repository, DataSource } from 'typeorm';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { User } from '@entities';
import { IUserRepository, UserRepository } from '@repositories';

import { UserRole } from '@lib/types';

describe('UserRepository', () => {
  let userRepository: IUserRepository;
  let repositoryMock: jest.Mocked<Repository<User>>;
  let dataSourceMock: jest.Mocked<DataSource>;
  let container: Container;

  beforeEach(() => {
    container = new Container();

    repositoryMock = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue(repositoryMock),
    } as unknown as jest.Mocked<DataSource>;

    container.bind<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource).toConstantValue(dataSourceMock);
    container.bind<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository).to(UserRepository);

    userRepository = container.get<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: UserRole.GUEST,
        created_at: new Date(),
      };

      repositoryMock.findOneBy.mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.findByEmail(mockUser.email);

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      // Arrange
      repositoryMock.findOneBy.mockResolvedValue(null);

      // Act
      const result = await userRepository.findByEmail('notfound@example.com');

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      // Arrange
      const userData: Partial<User> = {
        email: 'new@example.com',
        password_hash: 'secure_hash',
        role: UserRole.GUEST,
      };

      const savedUser: User = {
        id: '123',
        email: userData.email!,
        password_hash: userData.password_hash!,
        role: userData.role!,
        created_at: new Date(),
      };

      repositoryMock.create.mockReturnValue(savedUser);
      repositoryMock.save.mockResolvedValue(savedUser);

      // Act
      const result = await userRepository.create(userData);

      // Assert
      expect(repositoryMock.create).toHaveBeenCalledWith(userData);
      expect(repositoryMock.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });
});
