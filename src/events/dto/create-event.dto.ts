// src/events/dto/create-event.dto.ts
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @IsOptional()
  @IsString()
  homeTeam?: string;

  @IsOptional()
  @IsString()
  awayTeam?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coachIds?: string[];
}
