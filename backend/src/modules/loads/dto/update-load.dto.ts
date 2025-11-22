import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { LoadStatus } from '../../../common/enums';

export class UpdateLoadDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  scheduled_time?: string;

  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @IsOptional()
  @IsArray()
  coil_ids?: string[];
}
