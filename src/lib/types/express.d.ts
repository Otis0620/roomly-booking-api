import type { UserRole } from './userTypes';

/**
 * Express type augmentation.
 *
 * Extends the Express Request interface to include the authenticated
 * user attached by JWT middleware.
 */
declare global {
  namespace Express {
    /**
     * Authenticated user attached to request by JWT middleware.
     */
    interface User {
      id: string;
      email: string;
      role: UserRole;
    }
  }
}

export {};
