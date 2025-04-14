import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { TrainingRecord } from 'src/training-records/entities/training-record.entity';

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  training_id: number;

  @Column()
  training_date: Date;

  @Column()
  training_location: string;

  @Column({ type: 'text' })
  training_details: string;

  @ManyToOne(() => Coach, (coach) => coach.trainings)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @OneToMany(() => TrainingRecord, (record) => record.training)
  training_records: TrainingRecord[];
}
