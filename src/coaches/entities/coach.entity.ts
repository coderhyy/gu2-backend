import { Entity, Column, OneToMany } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Coach extends Member {
  @Column({ unique: true })
  coachId: string;

  @Column()
  responsibleTeam: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true })
  experience: number;

  @Column({ type: 'json', nullable: true })
  certifications: string[];

  @OneToMany(() => Player, (player) => player.coach)
  players: Player[];
}
