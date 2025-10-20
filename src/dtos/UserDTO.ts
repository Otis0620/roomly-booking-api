import { User } from '@entities';

import { dateToIsoString } from '@lib/helpers';
import { UserRole } from '@lib/types';

/**
 * Data Transfer Object for transforming and serializing User entities.
 */
export class UserDTO {
  id: string;
  email: string;
  role: string;
  createdAt: string;

  /**
   * Creates a new UserDTO instance.
   *
   * @param {string} id - Unique identifier of the user.
   * @param {string} email - Email address of the user.
   * @param {UserRole} role - Role assigned to the user.
   * @param {string} createdAt - Creation date in ISO string format.
   */
  constructor(id: string, email: string, role: UserRole, createdAt: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }

  /**
   * Creates a UserDTO from a User entity.
   *
   * @param {User} entity - The User entity to convert.
   * @returns {UserDTO} The corresponding UserDTO instance.
   */
  static fromEntity(entity: User): UserDTO {
    return new UserDTO(entity.id, entity.email, entity.role, dateToIsoString(entity.created_at));
  }
}
