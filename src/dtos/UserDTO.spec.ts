import { dateToIsoString } from '@lib/helpers';
import { UserRole } from '@lib/types';

import { UserDTO } from '@dtos';
import { User } from '@entities';

jest.mock('@lib/helpers', () => ({
  dateToIsoString: jest.fn((date: Date) => date.toISOString()),
}));

describe('UserDTO', () => {
  describe('fromEntity', () => {
    it('should correctly map a User entity to a UserDTO', () => {
      // Arrange
      const mockDate = new Date('2023-01-01T12:00:00Z');

      const userEntity: User = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.OWNER,
        created_at: mockDate,
      } as User;

      // Act
      const userDTO = UserDTO.fromEntity(userEntity);

      // Assert
      expect(userDTO).toEqual({
        id: '123',
        email: 'test@example.com',
        role: UserRole.OWNER,
        createdAt: mockDate.toISOString(),
      });

      expect(dateToIsoString).toHaveBeenCalledWith(mockDate);
    });
  });
});
