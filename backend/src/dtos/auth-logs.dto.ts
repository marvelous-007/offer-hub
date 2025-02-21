export interface CreateAuthLogDto {
    user_id: string;
    event_type: string;
    status: string;
    ip_address: string;
    user_agent: string;
    details: Record<string, any>;
  }
  
  export interface UpdateAuthLogDto {
    event_type: string;
    status: string;
    ip_address: string;
    user_agent: string;
    details: Record<string, any>;
  }
  
  export interface AuthLogResponseDto {
    auth_log_id: string;
    user_id: string | null;
    event_type: string;
    status: string;
    ip_address: string | null;
    user_agent: string | null;
    details: Record<string, any> | null;
    created_at: Date;
  }