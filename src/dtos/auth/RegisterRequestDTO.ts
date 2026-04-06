import { UserRole } from '@lib/types/userTypes';

export interface RegisterRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}
