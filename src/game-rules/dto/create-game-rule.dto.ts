import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateGameRuleDto {
  @IsNotEmpty()
  @IsString()
  rule_name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsObject()
  additional_info?: any;
} 