import * as bcrypt from 'bcrypt';
import { injectable, unmanaged } from 'inversify';

import { ICryptoManager } from './ICryptoManager';
import { ICryptoProvider } from './ICryptoProvider';

@injectable()
export class BcryptManager implements ICryptoManager {
  constructor(@unmanaged() private readonly cryptoProvider: ICryptoProvider = bcrypt) {}

  hash(data: string, saltRounds: number): Promise<string> {
    return this.cryptoProvider.hash(data, saltRounds);
  }

  genSalt(rounds: number): Promise<string> {
    return this.cryptoProvider.genSalt(rounds);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return this.cryptoProvider.compare(data, encrypted);
  }
}
