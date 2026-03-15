import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { BadRequestError } from '@errors/CustomErrors';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { UserRole } from '@lib/types/userTypes';
import { IUserRepository } from '@repositories/UserRepository';

import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: Partial<IUserRepository>;
  let mockBcryptManager: Partial<BcryptManager>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    mockBcryptManager = {
      hash: jest.fn(),
    };

    authService = new AuthService(
      mockUserRepository as Partial<IUserRepository> as IUserRepository,
      mockBcryptManager as Partial<BcryptManager> as BcryptManager,
    );
  });

  describe('register', () => {
    it('should throw a BadRequestError if user already exists', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: '12345',
        role: UserRole.GUEST,
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(existingUser);

      await expect(authService.register(existingUser)).rejects.toThrow(BadRequestError);
    });

    it('should look up the user by email', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.GUEST,
      };

      const createdUser = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (mockBcryptManager.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (mockUserRepository.create as jest.Mock).mockResolvedValueOnce(createdUser);

      await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@example.com');
    });

    it('should hash the password before creating the user', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.GUEST,
      };

      const createdUser = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (mockBcryptManager.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (mockUserRepository.create as jest.Mock).mockResolvedValueOnce(createdUser);

      await authService.register(registerDto);

      expect(mockBcryptManager.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'hashed_password' }),
      );
    });

    it('should create the user and return a RegisterResponseDTO', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.GUEST,
      };

      const createdUser = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (mockBcryptManager.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (mockUserRepository.create as jest.Mock).mockResolvedValueOnce(createdUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        createdAt: createdUser.createdAt.toISOString(),
      });
    });
  });
});
