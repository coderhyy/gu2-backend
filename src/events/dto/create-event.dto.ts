// src/events/dto/create-event.dto.ts
import { IsArray, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  event_name: string;

  @IsISO8601()
  @IsNotEmpty()
  event_date: string;

  @IsString()
  @IsNotEmpty()
  event_location: string;

  @IsString()
  @IsNotEmpty()
  event_description: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus = EventStatus.DRAFT;

  @IsString()
  @IsNotEmpty()
  teams_involved: string;

  @IsString()
  @IsOptional()
  results?: string;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  participant_ids?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  coach_ids?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  rule_ids?: number[];
  
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  team_ids?: number[];
}
