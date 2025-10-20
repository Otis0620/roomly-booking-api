import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';

import { Hotel } from './Hotel';

/**
 * TypeORM entity representing a room within a hotel.
 *
 * This model is mapped to the `rooms` table and stores
 * details such as the hotel it belongs to, type, price, and availability.
 */
@Entity('rooms')
export class Room {
  /**
   * Unique identifier for the room.
   * Automatically generated as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The hotel that this room belongs to.
   * Establishes a many-to-one relationship with the Hotel entity.
   */
  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  /**
   * Foreign key referencing the hotel's ID.
   * Automatically populated by TypeORM.
   */
  @RelationId((room: Room) => room.hotel)
  hotel_id: string;

  /**
   * Type or category of the room (e.g., single, double, suite).
   */
  @Column({ type: 'varchar', nullable: false })
  room_type: string;

  /**
   * Price of the room per night.
   */
  @Column({ type: 'decimal', nullable: false })
  price: number;

  /**
   * Indicates whether the room is currently available for booking.
   */
  @Column({ type: 'boolean', nullable: false })
  availability: boolean;
}
