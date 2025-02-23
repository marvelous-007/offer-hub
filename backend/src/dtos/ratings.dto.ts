import 'reflect-metadata';
import { IsUUID, IsInt, IsString, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRatingDto {
  @IsUUID('4')
  from_user_id!: string;

  @IsUUID('4')
  to_user_id!: string;

  @IsUUID('4')
  project_id!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  score!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class RatingResponseDto {
  rating_id!: string;
  from_user_id!: string;
  to_user_id!: string;
  project_id!: string;
  score!: number;
  comment!: string;
  created_at!: Date;
} 