import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { CoilStatus } from '../../../common/enums';

export class UpdateCoilDto {
  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsEnum(CoilStatus)
  status?: CoilStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  scheduled_for_date?: string;

  @IsOptional()
  @IsString()
  load?: string;
}
