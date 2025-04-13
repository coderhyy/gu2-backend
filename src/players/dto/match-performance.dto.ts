// src/players/dto/match-performance.dto.ts
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MatchPerformanceDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsOptional()
  @IsNumber()
  goalsScored?: number;

  @IsOptional()
  @IsNumber()
  assists?: number;

  @IsOptional()
  @IsNumber()
  minutesPlayed?: number;

  @IsOptional()
  @IsString()
  performance?: string;
}
