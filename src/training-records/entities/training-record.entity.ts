import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Training } from '../../trainings/entities/training.entity';

@Entity('training_records')
export class TrainingRecord {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column({ type: 'text' })
  performance: string;

  @Column({ type: 'text', nullable: true })
  passing_skill: string;

  @Column({ type: 'text', nullable: true })
  shooting_skill: string;

  @Column({ type: 'text', nullable: true })
  technical_skill: string;

  @Column({ type: 'text', nullable: true })
  tactical_skill: string;

  @Column({ type: 'text', nullable: true })
  physical_condition: string;

  @Column({ type: 'text', nullable: true })
  coach_comments: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Player, (player) => player.training_records)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Training, (training) => training.training_records)
  @JoinColumn({ name: 'training_id' })
  training: Training;
}
