import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, IsInt } from 'class-validator';

export class CreateLoadDto {
  @IsInt()
  @IsNotEmpty()
  load_number: number;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsOptional()
  @IsString()
  scheduled_time?: string;

  @IsDateString()
  @IsNotEmpty()
  created_for_date: string;

  @IsOptional()
  @IsArray()
  coil_ids?: string[];
}
