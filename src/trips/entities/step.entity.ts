import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class Step {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  coordinates: string;
  @Column('text')
  description?: string;
  @Column()
  pictures: string = '';
  @Column()
  date: string;
  @ManyToOne(() => Trip, (trip) => trip.steps, { onDelete: 'CASCADE' })
  trip: Trip;
}
