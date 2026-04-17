import { DataSource, Repository } from 'typeorm';

import { RefreshToken } from '@entities/RefreshToken';
import { User } from '@entities/User';
import { UserRole } from '@lib/types/userTypes';
import { RefreshTokenRepository } from '@repositories/RefreshTokenRepository';

describe('RefreshTokenRepository', () => {
  let refreshTokenRepository: RefreshTokenRepository;
  let mockRepository: jest.Mocked<Repository<RefreshToken>>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<RefreshToken>>;

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as unknown as jest.Mocked<DataSource>;

    refreshTokenRepository = new RefreshTokenRepository(mockDataSource);
  });

  describe('create', () => {
    it('should save a new refresh token', async () => {
      const userId = 'user-id-1';
      const tokenHash = 'hashed-token';
      const expiresAt = new Date('2026-05-01');

      mockRepository.save.mockResolvedValue({} as RefreshToken);

      await refreshTokenRepository.create(userId, tokenHash, expiresAt);

      expect(mockRepository.save).toHaveBeenCalledWith({ userId, tokenHash, expiresAt });
    });
  });

  describe('findByTokenHash', () => {
    it('should return the refresh token with user relation when found', async () => {
      const user: User = {
        id: 'user-id-1',
        email: 'user@example.com',
        firstName: 'James',
        lastName: 'Brown',
        role: UserRole.guest,
        suspended: false,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const refreshToken: RefreshToken = {
        id: 'token-id-1',
        userId: 'user-id-1',
        tokenHash: 'hashed-token',
        revoked: false,
        expiresAt: new Date('2026-05-01'),
        createdAt: new Date(),
        user,
      };

      mockRepository.findOne.mockResolvedValue(refreshToken);

      const result = await refreshTokenRepository.findByTokenHash('hashed-token');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tokenHash: 'hashed-token' },
        relations: { user: true },
      });
      expect(result).toEqual(refreshToken);
      expect(result?.user).toEqual(user);
    });

    it('should return null when token is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findByTokenHash('nonexistent-hash');

      expect(result).toBeNull();
    });
  });

  describe('revokeById', () => {
    it('should set revoked to true for the given token id', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 } as never);

      await refreshTokenRepository.revokeById('token-id-1');

      expect(mockRepository.update).toHaveBeenCalledWith({ id: 'token-id-1' }, { revoked: true });
    });
  });

  describe('revokeAllByUserId', () => {
    it('should set revoked to true for all tokens belonging to the user', async () => {
      mockRepository.update.mockResolvedValue({ affected: 3 } as never);

      await refreshTokenRepository.revokeAllByUserId('user-id-1');

      expect(mockRepository.update).toHaveBeenCalledWith(
        { userId: 'user-id-1' },
        { revoked: true },
      );
    });
  });
});
