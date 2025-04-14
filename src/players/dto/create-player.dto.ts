import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Member } from '../../members/entities/member.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

export class CreatePlayerDto {
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
  position?: string;

  @IsOptional()
  @IsString()
  skill_level?: string;

  @IsOptional()
  @IsString()
  performance_data?: string;

  @IsOptional()
  @IsNumber()
  coach_id?: number;
}
