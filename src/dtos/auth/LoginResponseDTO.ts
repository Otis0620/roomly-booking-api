import { UserRole } from '@lib/types/userTypes';

/**
 * Response data for user login.
 */
export interface LoginResponseDTO {
  token: string;
  user: AuthUserDTO;
}

/**
 * Authenticated user data returned on login.
 */
export interface AuthUserDTO {
  id: string;
  email: string;
  role: UserRole;
}
