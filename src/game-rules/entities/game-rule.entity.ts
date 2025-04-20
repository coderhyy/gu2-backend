import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity('game_rules')
export class GameRule {
  @PrimaryGeneratedColumn()
  rule_id: number;

  @Column()
  rule_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string; // 比如: 基本规则, 计分规则, 违规规则等

  @Column({ type: 'json', nullable: true })
  additional_info: any;

  @ManyToMany(() => Event, (event) => event.rules)
  @JoinTable({
    name: 'event_rules',
    joinColumn: { name: 'rule_id', referencedColumnName: 'rule_id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'event_id' }
  })
  events: Event[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 