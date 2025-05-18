import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';

import { ICryptoManager } from './ICryptoManager';

@injectable()
export class BcryptManager implements ICryptoManager {
  hash(data: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(data, saltRounds);
  }

  genSalt(rounds: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
