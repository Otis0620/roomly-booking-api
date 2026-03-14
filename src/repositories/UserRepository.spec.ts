import { DataSource, Repository } from 'typeorm';

import { User } from '@entities/User';
import { UserRole } from '@lib/types/userTypes';
import { UserRepository } from '@repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as unknown as jest.Mocked<DataSource>;

    userRepository = new UserRepository(mockDataSource);
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        role: UserRole.GUEST,
        createdAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await userRepository.findByEmail('test@example.com');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        role: UserRole.GUEST,
        createdAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await userRepository.findById('123');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await userRepository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData: Partial<User> = {
        email: 'new@example.com',
        passwordHash: 'hashedpassword',
        role: UserRole.GUEST,
      };
      const createdUser: User = {
        id: '456',
        email: 'new@example.com',
        passwordHash: 'hashedpassword',
        role: UserRole.GUEST,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await userRepository.create(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });
});
