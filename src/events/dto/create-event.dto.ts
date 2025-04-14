// src/events/dto/create-event.dto.ts
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  event_name: string;

  @IsDate()
  @IsNotEmpty()
  event_date: Date;

  @IsString()
  @IsNotEmpty()
  event_location: string;

  @IsArray()
  @IsNotEmpty()
  teams_involved: string[];

  @IsArray()
  @IsNotEmpty()
  results: string[];
}
