import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

import { UserRole } from '@lib/types';

/**
 * TypeORM entity representing a user in the system.
 *
 * This model is mapped to the `users` table and stores authentication
 * and authorization details such as email, password hash, and role.
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   * Generated automatically as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Email address of the user.
   * Must be unique and non-null.
   */
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  /**
   * Hashed password for authentication.
   * Stored securely and never exposed directly.
   */
  @Column({ type: 'varchar', nullable: false })
  password_hash: string;

  /**
   * Role assigned to the user.
   * Determines access level within the system.
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
    nullable: false,
  })
  role: UserRole;

  /**
   * Date and time the user record was created.
   * Automatically set by the database.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
