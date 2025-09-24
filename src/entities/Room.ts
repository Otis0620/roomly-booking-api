import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';

import { Hotel } from './Hotel';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @RelationId((room: Room) => room.hotel)
  hotel_id: string;

  @Column({ type: 'varchar', nullable: false })
  room_type: string;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: false })
  availability: boolean;
}
