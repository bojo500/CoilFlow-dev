import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { CoilStatus } from '../../../common/enums';

export class CreateCoilDto {
  @IsString()
  @IsNotEmpty()
  coil_id: string;

  @IsInt()
  @IsNotEmpty()
  width: number;

  @IsInt()
  @IsNotEmpty()
  weight: number;

  @IsOptional()
  @IsEnum(CoilStatus)
  status?: CoilStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  scheduled_for_date?: string;
}
