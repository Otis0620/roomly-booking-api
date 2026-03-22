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
