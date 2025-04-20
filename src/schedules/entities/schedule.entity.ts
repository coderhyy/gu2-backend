import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
// 注释掉直接导入，使用类型导入
// import { ScheduleItem } from './schedule-item.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  is_published: boolean;

  @Column({ nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  published_by: number; // 记录发布者ID

  @ManyToOne(() => Event, (event) => event.schedules)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  // 类型引用
  @OneToMany('ScheduleItem', 'schedule', { cascade: true })
  items: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 