export class CertificationEntity {
    certification_id: string;
    user_id: string;
    title: string;
    issuing_organization: string;
    issue_date: Date;
    expiry_date?: Date | null;
    credential_url?: string | null;
    verification_status: 'pending' | 'verified' | 'rejected';
    created_at: Date;
  
    constructor(data: Partial<CertificationEntity>) {
      this.certification_id = data.certification_id ?? "";
      this.user_id = data.user_id ?? "";
      this.title = data.title ?? "";
      this.issuing_organization = data.issuing_organization ?? "";
      this.issue_date = data.issue_date ?? new Date();
      this.expiry_date = data.expiry_date ?? null;
      this.credential_url = data.credential_url ?? null;
      this.verification_status = data.verification_status ?? 'pending';
      this.created_at = data.created_at ?? new Date();
    }
  }