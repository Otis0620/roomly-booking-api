import { Container } from 'inversify';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { getEnv } from '@config/env';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { IUserRepository } from '@repositories/UserRepository';

/**
 * Configures Passport.js with JWT authentication strategy.
 *
 * @param container - The DI container with registered dependencies
 */
export function configurePassport(container: Container): void {
  const userRepository = container.get<IUserRepository>(IDENTIFIERS.UserRepository);
  const env = getEnv();

  const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    'jwt',
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await userRepository.findById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error, false);
      }
    }),
  );
}
