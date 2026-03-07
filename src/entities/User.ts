import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

import { UserRole } from '@lib/types/userTypes';

/**
 * User entity representing a registered user in the system.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
    nullable: false,
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
