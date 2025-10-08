import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { BadRequestError, InternalServerError } from '@errors';
import { IUserRepository } from '@repositories';
import { AuthService } from '@services';

import { DEPENDENCY_IDENTIFIERS, getAppContainer } from '@infra/di';
import { UserRole } from '@lib/types';
import { registerUserValidator } from '@lib/validators';

const container = getAppContainer();

const authService = container.get<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService);
const userRepository = container.get<IUserRepository>(DEPENDENCY_IDENTIFIERS.IUserRepository);

/**
 * Passport Local Strategy for user registration (`local-signup`).
 *
 * - Validates incoming registration data using `registerUserValidator`.
 * - Registers a new user through the `AuthService`.
 * - Assigns role as `owner` if provided, otherwise defaults to `guest`.
 * - Returns a {@link BadRequestError} if validation fails, or {@link InternalServerError} for unexpected issues.
 */
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      try {
        const { error, value } = registerUserValidator.validate(req.body);

        if (error) {
          return done(new BadRequestError(), false);
        }

        const { role } = value;

        const userRole = role === UserRole.OWNER ? UserRole.OWNER : UserRole.GUEST;

        const user = await authService.register(email, password, userRole);

        return done(null, user);
      } catch (err: any) {
        if (err.status) {
          return done(err, false);
        }

        return done(new InternalServerError(), false);
      }
    },
  ),
);

/**
 * Passport Local Strategy for user authentication (`local-login`).
 *
 * - Authenticates users using provided email and password via `AuthService`.
 * - Returns a {@link BadRequestError} if credentials are invalid.
 * - Returns a {@link InternalServerError} for unexpected issues.
 */
passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const result = await authService.login(email, password);

        if (!result) {
          return done(new BadRequestError(), false);
        }

        return done(null, result);
      } catch (err: any) {
        return done(err?.status ? err : new InternalServerError(), false);
      }
    },
  ),
);

/**
 * Passport JWT Strategy for token-based authentication (`jwt`).
 *
 * - Extracts JWT from the Authorization header as a Bearer token.
 * - Verifies token using the configured `JWT_SECRET`.
 * - Retrieves user by ID from the repository and attaches it to the request.
 * - Returns `false` if user is not found, or an {@link InternalServerError} for unexpected issues.
 */
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload: { id: string; role: UserRole; email?: string }, done) => {
      try {
        const user = await userRepository.findById(payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, { id: user.id, email: user.email, role: user.role });
      } catch (err: any) {
        return done(err?.status ? err : new InternalServerError(), false);
      }
    },
  ),
);
