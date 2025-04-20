// src/events/entities/event.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  ManyToMany, 
  JoinTable,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { MatchPerformance } from '../../match-performance/entities/match-performance.entity';
import { Player } from '../../players/entities/player.entity';
import { Coach } from '../../coaches/entities/coach.entity';
import { Member } from '../../members/entities/member.entity';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

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
  event_description: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT
  })
  status: EventStatus;

  @Column({ type: 'text' })
  teams_involved: string;

  @Column({ type: 'text', nullable: true })
  results: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  published_at: Date;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'created_by' })
  created_by: Member;

  @ManyToMany(() => Player)
  @JoinTable({
    name: 'event_players',
    joinColumn: { name: 'event_id', referencedColumnName: 'event_id' },
    inverseJoinColumn: { name: 'player_id', referencedColumnName: 'player_id' }
  })
  participants: Player[];

  @ManyToMany(() => Coach)
  @JoinTable({
    name: 'event_coaches',
    joinColumn: { name: 'event_id', referencedColumnName: 'event_id' },
    inverseJoinColumn: { name: 'coach_id', referencedColumnName: 'coach_id' }
  })
  coaches: Coach[];

  @OneToMany(() => MatchPerformance, (performance) => performance.event)
  performances: MatchPerformance[];
}
