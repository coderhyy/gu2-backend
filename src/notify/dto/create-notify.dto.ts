import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateNotifyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsOptional()
  @IsNumber()
  player_id?: number;

  @IsOptional()
  @IsNumber()
  team_id?: number;

  @IsOptional()
  @IsBoolean()
  is_team_notification: boolean = false;
}
