import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Coach } from '../../coaches/entities/coach.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column()
  team_name: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  founded_year: number;

  @Column({ nullable: true })
  home_venue: string;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToMany(() => Coach, (coach) => coach.team)
  coaches: Coach[];

  @ManyToMany(() => Event, (event) => event.teams)
  events: Event[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 