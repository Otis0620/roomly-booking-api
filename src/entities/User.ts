import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { UserRole } from '@lib/types/userTypes';

/**
 * User entity representing a registered user in the system.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: false, select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', default: UserRole.GUEST, nullable: false })
  role!: UserRole;

  @Column({ type: 'boolean', default: false, nullable: false })
  suspended!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
