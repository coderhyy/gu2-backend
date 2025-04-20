import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
// 注释掉直接导入，使用类型导入
// import { Schedule } from './schedule.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  match_type: string; // 例如：小组赛、淘汰赛、决赛等

  // 使用字符串类型引用
  @ManyToOne('Schedule', 'items')
  @JoinColumn({ name: 'schedule_id' })
  schedule: any;

  @ManyToMany(() => Team)
  @JoinTable({
    name: 'schedule_item_teams',
    joinColumn: { name: 'item_id', referencedColumnName: 'item_id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'team_id' }
  })
  teams: Team[];

  @Column({ type: 'json', nullable: true })
  result: any; // 比赛结果，可以存储JSON格式的详细信息

  @Column({ default: 'pending' }) // pending, in_progress, completed, cancelled
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 