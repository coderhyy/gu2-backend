import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConsentFormDto {
  @IsNotEmpty()
  @IsString()
  guardian_name: string;

  @IsNotEmpty()
  @IsString()
  guardian_contact_info: string;

  @IsBoolean()
  @IsOptional()
  consent_signed?: boolean = false;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  signed_date?: Date;

  @IsNotEmpty()
  @IsNumber()
  player_id: number;
}
