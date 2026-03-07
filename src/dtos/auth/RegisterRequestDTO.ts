import { UserRole } from '@lib/types/userTypes';

/**
 * Request data for user registration.
 */
export interface RegisterRequestDTO {
  email: string;
  password: string;
  role?: UserRole;
}
