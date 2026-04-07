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
      createQueryBuilder: jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      }),
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
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
        suspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
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

  describe('findByEmailWithPassword', () => {
    it('should return user with passwordHash when found', async () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
        suspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const queryBuilder = mockRepository.createQueryBuilder('user');

      (queryBuilder.getOne as jest.Mock).mockResolvedValue(user);

      const result = await userRepository.findByEmailWithPassword('test@example.com');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.passwordHash');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
      expect(result?.passwordHash).toBe('hashedpassword');
    });

    it('should return null when user not found', async () => {
      const queryBuilder = mockRepository.createQueryBuilder('user');

      (queryBuilder.getOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmailWithPassword('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
        suspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
      };

      const createdUser: User = {
        id: '456',
        email: 'new@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
        suspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
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
