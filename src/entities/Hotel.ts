import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';

import { User } from './User';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @RelationId((hotel: Hotel) => hotel.owner)
  owner_id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'json', nullable: true })
  amenities: Record<string, any> | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  approved: boolean;
}
