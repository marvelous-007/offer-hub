export interface CreateNotificationDto {
  user_id: string;
  type: string;
  title: string;
  content: string;
  action_url: string;
}

export interface UpdateNotificationDto {
  type: string;
  title: string;
  content: string;
  read: boolean;
  action_url: string;
}
