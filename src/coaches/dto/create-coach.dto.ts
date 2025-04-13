// src/coaches/dto/create-coach.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateMemberDto } from '../../members/dto/create-member.dto';

export class CreateCoachDto extends CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  coachId: string;

  @IsNotEmpty()
  @IsString()
  responsibleTeam: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}
