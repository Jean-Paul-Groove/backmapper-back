import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Step } from './step.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  startDate: string;
  @Column()
  color: 'vert' | 'azur' | 'bleu' | 'rose' | 'violet' | 'rouge' | 'jaune';
  @OneToMany(() => Step, (step) => step.trip)
  steps?: Step[];
}
