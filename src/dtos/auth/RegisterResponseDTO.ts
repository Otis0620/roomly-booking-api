import { UserRole } from '@lib/types/userTypes';

/**
 * Response data for user registration.
 */
export interface RegisterResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}
