import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';

import { RefreshToken } from '@entities/RefreshToken';
import { IDENTIFIERS } from '@infra/di/identifiers';

export interface IRefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeById(id: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private repository: Repository<RefreshToken>;

  /**
   * @param dataSource - TypeORM DataSource injected by InversifyJS
   */
  constructor(@inject(IDENTIFIERS.DataSource) dataSource: DataSource) {
    this.repository = dataSource.getRepository(RefreshToken);
  }

  async create(userId: string, tokenHash: string, expiresAt: Date) {
    await this.repository.save({ userId, tokenHash, expiresAt });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return await this.repository.findOne({ where: { tokenHash }, relations: { user: true } });
  }

  async revokeById(id: string): Promise<void> {
    await this.repository.update({ id }, { revoked: true });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.repository.update({ userId }, { revoked: true });
  }
}
