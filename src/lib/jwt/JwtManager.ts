import { injectable, unmanaged } from 'inversify';
import * as JwtProvider from 'jsonwebtoken';

import { IJwtManager, IJwtSignOptions } from './IJwtManager';

@injectable()
export class JwtManager implements IJwtManager {
  constructor(@unmanaged() private readonly jwtProvider = JwtProvider) {}

  sign<T extends object>(payload: T, secret: string, options?: IJwtSignOptions): string {
    return this.jwtProvider.sign(payload, secret, options);
  }

  verify<T>(token: string, secret: string): T {
    return this.jwtProvider.verify(token, secret) as T;
  }

  decode<T = unknown>(token: string): T | null {
    return this.jwtProvider.decode(token) as T | null;
  }
}
