import { UserRole } from './userTypes';

/**
 * Express type augmentation.
 *
 * Extends the Express Request interface to include the authenticated
 * user attached by Passport JWT middleware.
 */
declare global {
  namespace Express {
    /**
     * Authenticated user attached to request by Passport JWT strategy.
     */
    interface User {
      id: string;
      email: string;
      role: UserRole;
    }
  }
}

export {};
