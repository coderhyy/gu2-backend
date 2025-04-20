import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMatchPerformanceDto {
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @IsNotEmpty()
  @IsNumber()
  event_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  goals: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  assists: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minutes_played: number;

  @IsOptional()
  @IsNumber()
  yellow_cards?: number;

  @IsOptional()
  @IsNumber()
  red_cards?: number;

  @IsOptional()
  @IsNumber()
  shots_on_target?: number;

  @IsOptional()
  @IsNumber()
  passes_completed?: number;

  @IsOptional()
  @IsNumber()
  tackles?: number;

  @IsOptional()
  @IsString()
  coach_comments?: string;
}
