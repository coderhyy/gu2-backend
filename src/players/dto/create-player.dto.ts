// src/players/dto/create-player.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Position, SkillLevel } from '../entities/player.entity';
import { CreateMemberDto } from '../../members/dto/create-member.dto';

export class CreatePlayerDto extends CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  playerNumber: string;

  @IsNotEmpty()
  @IsString()
  team: string;

  @IsEnum(Position)
  position: Position;

  @IsEnum(SkillLevel)
  @IsOptional()
  skillLevel?: SkillLevel;
}
