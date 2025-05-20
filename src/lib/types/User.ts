import { UserDTO } from '@dtos';

export enum UserRole {
  GUEST = 'guest',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export type UserLoginResponse = { user: UserDTO; token: string };
