import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { User } from '@entities/User';
import { BadRequestError, UnauthorizedError } from '@errors/CustomErrors';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { JwtManager } from '@lib/jwt/JwtManager';
import { UserRole } from '@lib/types/userTypes';
import { IUserRepository } from '@repositories/UserRepository';

import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: Partial<IUserRepository>;
  let mockBcryptManager: Partial<BcryptManager>;
  let mockJwtManager: Partial<JwtManager>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      create: jest.fn(),
    };

    mockBcryptManager = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    mockJwtManager = {
      sign: jest.fn(),
    };

    authService = new AuthService(
      mockUserRepository as Partial<IUserRepository> as IUserRepository,
      mockBcryptManager as Partial<BcryptManager> as BcryptManager,
      mockJwtManager as Partial<JwtManager> as JwtManager,
    );
  });

  describe('register', () => {
    it('should throw a BadRequestError if user already exists', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'existing@example.com',
        password: '12345',
        role: UserRole.GUEST,
      };

      const existingUser: User = {
        id: 'user-id-1',
        email: 'existing@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(BadRequestError);
    });

    it('should look up the user by email', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'new@example.com',
        password: '12345',
        role: UserRole.GUEST,
      };

      const createdUser: User = {
        id: 'user-id-1',
        email: 'new@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (mockBcryptManager.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (mockUserRepository.create as jest.Mock).mockResolvedValueOnce(createdUser);

      await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('new@example.com');
    });

    it('should hash the password before creating the user', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'new@example.com',
        password: '12345',
        role: UserRole.GUEST,
      };

      const createdUser: User = {
        id: 'user-id-1',
        email: 'new@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (mockBcryptManager.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (mockUserRepository.create as jest.Mock).mockResolvedValueOnce(createdUser);

      await authService.register(registerDto);

      expect(mockBcryptManager.hash).toHaveBeenCalledWith('12345');
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'hashed_password' }),
      );
    });

    it('should create the user and return a RegisterResponseDTO', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'new@example.com',
        password: '12345',
        role: UserRole.GUEST,
      };

      const createdUser: User = {
        id: 'user-id-1',
        email: 'new@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
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

  describe('login', () => {
    it('should throw UnauthorizedError if user is not found', async () => {
      const loginDto: LoginRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
      };

      (mockUserRepository.findByEmailWithPassword as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if password is invalid', async () => {
      const loginDto: LoginRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
      };

      const storedUser: User = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmailWithPassword as jest.Mock).mockResolvedValueOnce(storedUser);
      (mockBcryptManager.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedError);
    });

    it('should compare the password against the stored hash', async () => {
      const loginDto: LoginRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
      };

      const storedUser: User = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmailWithPassword as jest.Mock).mockResolvedValueOnce(storedUser);
      (mockBcryptManager.compare as jest.Mock).mockResolvedValueOnce(true);
      (mockJwtManager.sign as jest.Mock).mockReturnValueOnce('jwt-token');

      await authService.login(loginDto);

      expect(mockBcryptManager.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should return a token on successful login', async () => {
      const loginDto: LoginRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
      };

      const storedUser: User = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockUserRepository.findByEmailWithPassword as jest.Mock).mockResolvedValueOnce(storedUser);
      (mockBcryptManager.compare as jest.Mock).mockResolvedValueOnce(true);
      (mockJwtManager.sign as jest.Mock).mockReturnValueOnce('jwt-token');

      const result = await authService.login(loginDto);

      expect(mockJwtManager.sign).toHaveBeenCalledWith({
        sub: 'user-id-1',
        role: UserRole.GUEST,
      });
      expect(result).toEqual({ token: 'jwt-token' });
    });
  });
});
