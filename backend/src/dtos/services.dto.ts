import { IsUUID, IsString, IsNumber, IsBoolean, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @IsUUID(4)
  freelancer_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  base_price: number;

  @IsNumber()
  @Min(1)
  delivery_time_days: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateServiceDto {
  @IsString()
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  base_price?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  delivery_time_days?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class ServiceResponseDto {
  service_id: string;
  freelancer_id: string;
  title: string;
  description: string;
  base_price: number;
  delivery_time_days: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}