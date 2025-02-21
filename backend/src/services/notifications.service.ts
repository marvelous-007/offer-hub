import { v4 as uuidv4 } from "uuid";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../dtos/notifications.dto";
import { NotificationEntity } from "../entities/notifications.entity";

const notifications: NotificationEntity[] = [];

const getAll = (): NotificationEntity[] => notifications;

const create = (data: CreateNotificationDto): NotificationEntity => {
  const newNotification = new NotificationEntity({
    id: uuidv4(),
    ...data,
    created_at: new Date(),
  });
  notifications.push(newNotification);
  return newNotification;
};

const getById = (id: string): NotificationEntity | undefined =>
  notifications.find((n) => n.id === id);

const update = (
  id: string,
  data: UpdateNotificationDto
): NotificationEntity | null => {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notifications[index] = { ...notifications[index], ...data };
  return notifications[index];
};

const deleteNotification = (id: string): boolean => {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notifications.splice(index, 1);
  return true;
};

export default { getAll, create, getById, update, delete: deleteNotification };
