import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserRole } from '@lib/types';

import { BadRequestError, InternalServerError } from '@errors';
import { AuthService } from '@services';
import { registerUserValidator } from '@validators';

import { DEPENDENCY_IDENTIFIERS } from './dependencyIdentifiers';
import { container } from './inversify.config';

const authService = container.get<AuthService>(DEPENDENCY_IDENTIFIERS.AuthService);

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
          return done(new BadRequestError('Invalid input'), false);
        }

        const { role } = value;

        const userRole = role === 'owner' ? UserRole.OWNER : UserRole.GUEST;

        const user = await authService.register(email, password, userRole);

        return done(null, user);
      } catch (err: any) {
        console.error('Passport local-signup error:', err);

        if (err.status) {
          return done(err, false);
        }

        return done(new InternalServerError('An unexpected error occurred'), false);
      }
    },
  ),
);
