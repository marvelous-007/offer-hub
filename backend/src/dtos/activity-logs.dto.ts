export class CreateActivityLogsDto {
    action_type: string;
    entity_type: string;
    entity_id?: string;
    details?: Record<string, any>;
    ip_address?: string;
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