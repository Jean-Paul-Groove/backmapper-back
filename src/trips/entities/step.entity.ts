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
  pitcures: string = '';
  @Column()
  date: string;
  @ManyToOne(() => Trip, (trip) => trip.steps)
  trip: Trip;
}
