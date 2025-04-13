// src/members/entities/member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../../auth/role.enum';

export enum MembershipType {
  REGULAR = 'regular',
  PREMIUM = 'premium',
  VIP = 'vip',
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
    default: MembershipType.REGULAR,
  })
  membershipType: MembershipType;

  @Column()
  password: string;

  @CreateDateColumn()
  registrationTime: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;
}
