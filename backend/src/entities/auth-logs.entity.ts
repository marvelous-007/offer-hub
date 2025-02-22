export class AuthLogEntity {
    auth_log_id: string;
    user_id: string | null;
    event_type: string;
    status: string;
    ip_address: string | null;
    user_agent: string | null;
    details: Record<string, any> | null;
    created_at: Date;
  
    constructor(data: Partial<AuthLogEntity>) {
      this.auth_log_id = data.auth_log_id ?? "";
      this.user_id = data.user_id ?? null;
      this.event_type = data.event_type ?? "";
      this.status = data.status ?? "";
      this.ip_address = data.ip_address ?? null;
      this.user_agent = data.user_agent ?? null;
      this.details = data.details ?? null;
      this.created_at = data.created_at ?? new Date();
    }
  }