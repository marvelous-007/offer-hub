import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateActivityLogsDto {
    @IsString()
    action_type: string;

    @IsString()
    entity_type: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    entity_id?: string;

    details?: Record<string, any>;

    @IsString()
    @IsOptional()
    ip_address?: string;

    @IsString()
    @IsOptional()
    user_agent?: string;
}


export class UpdateActivityLogsDto {
    action_type?: string;
    entity_type?: string;
    entity_id?: string;
    details?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
}