import { IsString, IsNotEmpty } from 'class-validator';

export class CacheInvalidationDto {
  @IsString()
  @IsNotEmpty()
  pattern: string;
} 