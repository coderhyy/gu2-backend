// src/players/entities/player.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Coach } from '../../coaches/entities/coach.entity';

export enum Position {
  FORWARD = 'forward',
  MIDFIELDER = 'midfielder',
  DEFENDER = 'defender',
  GOALKEEPER = 'goalkeeper',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional',
}

@Entity()
export class Player extends Member {
  @Column({ unique: true })
  playerNumber: string;

  @Column()
  team: string;

  @Column({
    type: 'enum',
    enum: Position,
  })
  position: Position;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.BEGINNER,
  })
  skillLevel: SkillLevel;

  @Column({ type: 'json', nullable: true })
  gameData: any;

  @Column({ type: 'int', default: 0 })
  goalsScored: number;

  @Column({ type: 'int', default: 0 })
  assists: number;

  @ManyToOne(() => Coach, (coach) => coach.players)
  coach: Coach;
}
