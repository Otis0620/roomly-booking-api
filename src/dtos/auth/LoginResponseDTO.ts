import type { UserRole } from '@lib/types/userTypes';

export interface LoginResponseDTO {
  token: string;
  user: AuthUserDTO;
}

export interface AuthUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
