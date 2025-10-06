import { Request } from 'express';

import { AuthUser } from '@lib/types';

/**
 * Represents the authenticated user information available in an HTTP request.
 *
 * This type is derived from the `user` property of the AuthUser object,
 * containing only the user-related fields. It is used to describe the
 * authenticated identity attached to a request.
 */
export type AuthPrincipal = AuthUser['user'];

/**
 * Extends the standard Express Request object to include a typed `user` property.
 *
 * This type should be used in controllers or middleware that expect an
 * authenticated user to be present on the request. It provides full typing
 * support for `req.user`, enabling safer and more predictable access to
 * user information throughout request handling.
 */
export type RequestWithUser = Request & { user: AuthPrincipal };
