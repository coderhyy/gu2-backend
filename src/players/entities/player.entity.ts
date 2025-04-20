import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { TrainingRecord } from 'src/training-records/entities/training-record.entity';
import { ConsentForm } from 'src/consent-forms/entities/consent-form.entity';
import { MatchPerformance } from 'src/match-performance/entities/match-performance.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  player_id: number;

  @Column({ nullable: true })
  team_name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  skill_level: string;

  @Column({ type: 'text', nullable: true })
  performance_data: string;

  @ManyToOne(() => Member, (member) => member.players)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Team, (team) => team.players)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany(() => TrainingRecord, (record) => record.player)
  training_records: TrainingRecord[];

  @OneToMany(() => ConsentForm, (consent) => consent.player)
  consent_forms: ConsentForm[];

  @OneToMany(() => MatchPerformance, (performance) => performance.player)
  performances: MatchPerformance[];
}
