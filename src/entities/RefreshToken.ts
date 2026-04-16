import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', type: 'varchar', nullable: false })
  userId!: string;

  @Column({ name: 'token_hash', type: 'varchar', nullable: false, unique: true })
  tokenHash!: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  revoked!: boolean;

  @Column({ name: 'expires_at', type: 'datetime', nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;
}
