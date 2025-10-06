import { UserDTO } from '@dtos';

/**
 * Defines all possible roles assigned to an authenticated user.
 *
 * - `GUEST`: Basic access, limited permissions.
 * - `OWNER`: Full access to owned resources.
 * - `ADMIN`: Elevated privileges across the application.
 */
export enum UserRole {
  GUEST = 'guest',
  OWNER = 'owner',
  ADMIN = 'admin',
}

/**
 * Represents the authenticated user returned from authentication services.
 *
 * This type includes the user data (`UserDTO`) and an optional authentication
 * token. It is typically used as the response type for login or registration
 * operations.
 */
export type AuthUser = {
  /** User information and profile data. */
  user: UserDTO;

  /** Optional authentication token (e.g., JWT). */
  token?: string;
};
