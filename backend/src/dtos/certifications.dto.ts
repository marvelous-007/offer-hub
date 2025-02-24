export interface CreateCertificationDto {
    user_id: string;
    title: string;
    issuing_organization: string;
    issue_date: Date;
    expiry_date?: Date;
    credential_url?: string;
  }

export interface UpdateCertificationDto {
    title?: string;
    issuing_organization?: string;
    issue_date?: Date;
    expiry_date?: Date | null;
    credential_url?: string | null;
    verification_status?: 'pending' | 'verified' | 'rejected';
  }