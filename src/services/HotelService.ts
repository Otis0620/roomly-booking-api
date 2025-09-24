import { inject, injectable } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { IUserRepository } from '@repositories';

@injectable()
export class HotelService {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
  ) {}
}
