// src/members/entities/member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MemberType } from '../../auth/role.enum';
import { Coach } from '../../coaches/entities/coach.entity';
import { Player } from '../../players/entities/player.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  member_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_info?: string;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.MEMBER,
  })
  member_type: MemberType;

  @CreateDateColumn()
  registration_date: Date;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @OneToMany(() => Coach, (coach) => coach.member)
  coaches: Coach[];

  @OneToMany(() => Player, (player) => player.member)
  players: Player[];
}
