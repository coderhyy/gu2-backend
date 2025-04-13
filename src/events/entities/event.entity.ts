// src/events/entities/event.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Coach } from '../../coaches/entities/coach.entity';

export enum EventType {
  MATCH = 'match',
  TRAINING = 'training',
  FRIENDLY = 'friendly',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.MATCH,
  })
  eventType: EventType;

  @Column({ nullable: true })
  homeTeam: string;

  @Column({ nullable: true })
  awayTeam: string;

  @Column({ nullable: true })
  score: string;

  @Column({ type: 'json', nullable: true })
  result: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Player)
  @JoinTable()
  participants: Player[];

  @ManyToMany(() => Coach)
  @JoinTable()
  coaches: Coach[];
}
