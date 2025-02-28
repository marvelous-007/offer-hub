import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  conversation_id: string;

  @IsUUID()
  sender_id: string;

  @IsString()
  content: string;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  read_at?: Date;
}
