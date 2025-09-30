import { inject, injectable } from 'inversify';

import { IUserRepository } from '@repositories';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';

@injectable()
export class HotelService {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
  ) {}
}
