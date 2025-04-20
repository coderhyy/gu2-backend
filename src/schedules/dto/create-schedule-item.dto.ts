import { IsNotEmpty, IsOptional, IsString, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_time: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  match_type?: string;

  @IsNotEmpty()
  @IsArray()
  team_ids: number[];

  @IsOptional()
  @IsString()
  status?: string;
} 