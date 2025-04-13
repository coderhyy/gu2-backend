// src/coaches/dto/add-player-profile.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlayerProfileDto {
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsNotEmpty()
  @IsString()
  notes: string;
}
