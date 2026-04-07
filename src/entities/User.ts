import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '@lib/types/userTypes';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: false, select: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: Object.values(UserRole),
    default: UserRole.guest,
    nullable: false,
  })
  role!: UserRole;

  @Column({ type: 'boolean', default: false, nullable: false })
  suspended!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
