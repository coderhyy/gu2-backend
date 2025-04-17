// src/members/dto/create-member.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberType } from '../../auth/role.enum';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  team_name?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  skill_level: string;

  @IsOptional()
  @IsString()
  contact_info?: string;

  @IsEnum(MemberType)
  @IsOptional()
  member_type?: MemberType;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  consent_form_url?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_of_birth?: Date;
}
