import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Training } from 'src/trainings/entities/training.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn()
  coach_id: number;

  @Column({ nullable: true })
  team_name: string;

  @Column({ nullable: true })
  contact_info: string;

  @ManyToOne(() => Member, (member) => member.coaches)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @OneToMany(() => Training, (training) => training.coach)
  trainings: Training[];
}
