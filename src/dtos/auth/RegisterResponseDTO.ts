import { UserRole } from '@lib/types/userTypes';

export interface RegisterResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}
