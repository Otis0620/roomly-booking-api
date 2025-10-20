import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';

import { User } from './User';

/**
 * TypeORM entity representing a hotel.
 *
 * This model is mapped to the `hotels` table and stores
 * hotel details such as owner, name, location, and amenities.
 */
@Entity('hotels')
export class Hotel {
  /**
   * Unique identifier for the hotel.
   * Automatically generated as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The user who owns this hotel.
   * Establishes a many-to-one relationship with the User entity.
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  /**
   * Foreign key referencing the owner's user ID.
   * Populated automatically by TypeORM.
   */
  @RelationId((hotel: Hotel) => hotel.owner)
  owner_id: string;

  /**
   * Name of the hotel.
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;

  /**
   * Optional description of the hotel.
   */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * Physical location of the hotel.
   */
  @Column({ type: 'varchar', nullable: false })
  location: string;

  /**
   * Optional structured data describing hotel amenities (e.g., Wi-Fi, parking).
   * Stored as a JSON object.
   */
  @Column({ type: 'json', nullable: true })
  amenities: Record<string, any> | null;

  /**
   * Indicates whether the hotel has been approved.
   * Defaults to `false`.
   */
  @Column({ type: 'boolean', default: false, nullable: false })
  approved: boolean;
}
