export class NotificationEntity {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  action_url?: string;
  created_at: Date;

  constructor(data: Partial<NotificationEntity>) {
    this.id = data.id ?? "";
    this.user_id = data.user_id;
    this.type = data.type ?? "";
    this.title = data.title ?? "";
    this.content = data.content ?? "";
    this.read = data.read ?? false;
    this.action_url = data.action_url;
    this.created_at = data.created_at ?? new Date();
  }
}
