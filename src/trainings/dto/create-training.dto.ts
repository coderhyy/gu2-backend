import { IsDateString, IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';

export class CreateTrainingDto {
  @IsDateString()
  @IsNotEmpty()
  training_date: Date;

  @IsString()
  @IsNotEmpty()
  training_location: string;

  @IsString()
  @IsNotEmpty()
  training_details: string;

  @IsNumber()
  @IsNotEmpty()
  coach_id: number;

  @IsArray()
  @IsNotEmpty()
  player_ids: number[];
}
