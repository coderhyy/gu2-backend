import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrainingRecordDto {
  @IsNotEmpty()
  @IsNumber()
  player_id: number;

  @IsNotEmpty()
  @IsNumber()
  training_id: number;

  @IsNotEmpty()
  @IsString()
  performance: string;

  @IsOptional()
  @IsString()
  passing_skill: string;

  @IsOptional()
  @IsString()
  shooting_skill: string;

  @IsOptional()
  @IsString()
  technical_skill: string;

  @IsOptional()
  @IsString()
  tactical_skill: string;

  @IsOptional()
  @IsString()
  physical_condition: string;

  @IsOptional()
  @IsString()
  coach_comments: string;
}
