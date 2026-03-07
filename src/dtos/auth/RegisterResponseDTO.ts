import { User } from '@entities/User';
import { UserRole } from '@lib/types/userTypes';

/**
 * Response data for user registration.
 */
export interface RegisterResponseDTO {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Converts a User entity to a registration response DTO.
 *
 * @param user - User entity from database
 * @returns Registration response data
 */
export function toRegisterResponseDTO(user: User): RegisterResponseDTO {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
