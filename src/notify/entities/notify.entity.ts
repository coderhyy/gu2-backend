import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('notifications')
export class Notify {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ default: false })
  is_team_notification: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Coach, { nullable: false })
  @JoinColumn({ name: 'coach_id' })
  sender: Coach;

  // 如果是个人通知，关联单个队员
  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  // 如果是团队通知，关联整个团队
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
