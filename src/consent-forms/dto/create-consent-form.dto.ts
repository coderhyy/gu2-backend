import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConsentFormDto {
  @IsNotEmpty()
  @IsString()
  guardian_name: string;

  @IsNotEmpty()
  @IsString()
  guardian_contact_info: string;

  @IsBoolean()
  @IsOptional()
  consent_signed?: boolean = true;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  signed_date?: Date = new Date();

  @IsNotEmpty()
  @IsNumber()
  player_id: number;
}
