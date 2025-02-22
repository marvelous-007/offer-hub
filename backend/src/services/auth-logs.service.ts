import { v4 as uuidv4 } from "uuid";
import {
  CreateAuthLogDto,
  UpdateAuthLogDto,
} from "../dtos/auth-logs.dto";
import { AuthLogEntity } from "../entities/auth-logs.entity";

const authLogs: AuthLogEntity[] = [];

const getAll = (): AuthLogEntity[] => authLogs;

const create = (data: CreateAuthLogDto): AuthLogEntity => {
  const newAuthLog = new AuthLogEntity({
    auth_log_id: uuidv4(),
    ...data,
    created_at: new Date(),
  });
  authLogs.push(newAuthLog);
  return newAuthLog;
};

const getById = (id: string): AuthLogEntity | undefined =>
  authLogs.find((log) => log.auth_log_id === id);

const update = (
  id: string,
  data: UpdateAuthLogDto
): AuthLogEntity | null => {
  const index = authLogs.findIndex((log) => log.auth_log_id === id);
  if (index === -1) return null;
  authLogs[index] = { ...authLogs[index], ...data };
  return authLogs[index];
};

const deleteAuthLog = (id: string): boolean => {
  const index = authLogs.findIndex((log) => log.auth_log_id === id);
  if (index === -1) return false;
  authLogs.splice(index, 1);
  return true;
};

// Additional methods specific to auth logs
const getByUserId = (userId: string): AuthLogEntity[] =>
  authLogs.filter((log) => log.user_id === userId);

const getByEventType = (eventType: string): AuthLogEntity[] =>
  authLogs.filter((log) => log.event_type === eventType);

const getByDateRange = (startDate: Date, endDate: Date): AuthLogEntity[] =>
  authLogs.filter(
    (log) => log.created_at >= startDate && log.created_at <= endDate
  );

export default {
  getAll,
  create,
  getById,
  update,
  delete: deleteAuthLog,
  getByUserId,
  getByEventType,
  getByDateRange,
};