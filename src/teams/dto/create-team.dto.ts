import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  team_name: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  founded_year?: number;

  @IsOptional()
  @IsString()
  home_venue?: string;

  @IsOptional()
  @IsArray()
  player_ids?: number[];

  @IsOptional()
  @IsArray()
  coach_ids?: number[];
} 