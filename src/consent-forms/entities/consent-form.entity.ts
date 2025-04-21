import { Player } from 'src/players/entities/player.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('consent_forms')
export class ConsentForm {
  @PrimaryGeneratedColumn()
  consent_id: number;

  @Column()
  guardian_name: string;

  @Column()
  guardian_contact_info: string;

  @Column({ type: 'tinyint', default: false })
  consent_signed: boolean;

  @Column({ nullable: true })
  signed_date: Date;

  @ManyToOne(() => Player, (player) => player.consent_forms)
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
