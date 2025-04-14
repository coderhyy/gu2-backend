import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Member } from '../../members/entities/member.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

export class CreateCoachDto {
  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @IsOptional()
  @IsString()
  team_name?: string;

  @IsOptional()
  @IsString()
  contact_info?: string;
}
