import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Training } from '../../trainings/entities/training.entity';

@Entity('training_records')
export class TrainingRecord {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column({ type: 'text' })
  performance: string;

  @ManyToOne(() => Player, (player) => player.training_records)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Training, (training) => training.training_records)
  @JoinColumn({ name: 'training_id' })
  training: Training;
}
