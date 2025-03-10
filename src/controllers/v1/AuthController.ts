import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import passport from 'passport';

@injectable()
export class AuthController {
  register(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local-signup', { session: false }, (err, user, info) => {
      if (err) {
        return res
          .status(err.status || 500)
          .json({ error: err.message || 'Registration failed', code: err.status || 500 });
      }

      if (!user) {
        return res.status(400).json({ error: info?.message || 'Registration failed', code: 400 });
      }

      return res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      });
    })(req, res, next);
  }
}
