import { Player } from 'src/players/entities/player.entity';
import { Event } from 'src/events/entities/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('match_performance')
export class MatchPerformance {
  @PrimaryGeneratedColumn()
  performance_id: number;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  minutes_played: number;

  @Column({ default: 0 })
  yellow_cards: number;

  @Column({ default: 0 })
  red_cards: number;

  @Column({ nullable: true })
  shots_on_target: number;

  @Column({ nullable: true })
  passes_completed: number;

  @Column({ nullable: true })
  tackles: number;

  @Column({ type: 'text', nullable: true })
  coach_comments: string;

  @CreateDateColumn()
  recorded_at: Date;

  @ManyToOne(() => Player, (player) => player.performances)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Event, (event) => event.performances)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
