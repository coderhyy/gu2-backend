// src/members/dto/create-member.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MembershipType } from '../entities/member.entity';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEnum(MembershipType)
  @IsOptional()
  membershipType?: MembershipType;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;
}
