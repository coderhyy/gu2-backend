import { Player } from 'src/players/entities/player.entity';
import { Event } from 'src/events/entities/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => Player, (player) => player.performances)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Event, (event) => event.performances)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
