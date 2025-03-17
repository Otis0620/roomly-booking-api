import { User } from '@entities';

import { dateToIsoString } from '@lib/helpers';
import { UserRole } from '@lib/types';

export class UserDTO {
  id: string;
  email: string;
  role: string;
  createdAt: string;

  constructor(id: string, email: string, role: UserRole, createdAt: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }

  static fromEntity(entity: User): UserDTO {
    return new UserDTO(entity.id, entity.email, entity.role, dateToIsoString(entity.created_at));
  }
}
