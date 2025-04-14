// src/events/entities/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MatchPerformance } from '../../match-performance/entities/match-performance.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column()
  event_name: string;

  @Column()
  event_date: Date;

  @Column()
  event_location: string;

  @Column({ type: 'text' })
  teams_involved: string;

  @Column({ type: 'text' })
  results: string;

  @Column()
  created_at: Date;

  @OneToMany(() => MatchPerformance, (performance) => performance.event)
  performances: MatchPerformance[];
}
