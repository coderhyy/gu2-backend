import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
} from 'class-validator';

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
  @IsDateString()
  founded_year?: string;

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
