import { Injectable, Logger } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface ApiRequestLog {
  path: string;
  method: string;
  userId: string;
  requestBody: string;
  timestamp: Date;
  ip?: string;
}

interface ApiResponseLog {
  path: string;
  statusCode: number;
  responseBody: string;
  timestamp: Date;
}

interface ApiErrorLog {
  path: string;
  statusCode: number;
  errorMessage: string;
  timestamp: Date;
  stack?: string;
}

@Injectable()
export class GatewayLogService {
  private readonly logger = new Logger(GatewayLogService.name);
  private readonly logDir = join(process.cwd(), 'logs');
  private readonly requestLogFile = join(this.logDir, 'api-requests.log');
  private readonly responseLogFile = join(this.logDir, 'api-responses.log');
  private readonly errorLogFile = join(this.logDir, 'api-errors.log');

  constructor() {
    this.initLogDirectories();
  }

  private async initLogDirectories(): Promise<void> {
    try {
      await mkdir(this.logDir, { recursive: true });
      this.logger.log(`Log directory initialized at ${this.logDir}`);
    } catch (error) {
      this.logger.error(`Failed to create log directory: ${error.message}`);
    }
  }

  async logApiRequest(log: ApiRequestLog): Promise<void> {
    try {
      const logEntry = {
        ...log,
        timestamp: new Date().toISOString(),
      };
      await this.appendToLogFile(this.requestLogFile, JSON.stringify(logEntry));
      this.logger.log(`API Request logged: ${log.method} ${log.path}`);
    } catch (error) {
      this.logger.error(`Failed to log API request: ${error.message}`);
    }
  }

  async logApiResponse(log: ApiResponseLog): Promise<void> {
    try {
      const logEntry = {
        ...log,
        timestamp: new Date().toISOString(),
      };
      await this.appendToLogFile(this.responseLogFile, JSON.stringify(logEntry));
      this.logger.log(`API Response logged: ${log.path} (${log.statusCode})`);
    } catch (error) {
      this.logger.error(`Failed to log API response: ${error.message}`);
    }
  }

  async logApiError(log: ApiErrorLog): Promise<void> {
    try {
      const logEntry = {
        ...log,
        timestamp: new Date().toISOString(),
      };

      await this.appendToLogFile(this.errorLogFile, JSON.stringify(logEntry));
      this.logger.error(`API Error logged: ${log.path} (${log.statusCode}): ${log.errorMessage}`);
    } catch (error) {
      this.logger.error(`Failed to log API error: ${error.message}`);
    }
  }

  private async appendToLogFile(filePath: string, content: string): Promise<void> {
    try {
      await writeFile(filePath, content + '\n', { flag: 'a' });
    } catch (error) {
      this.logger.error(`Failed to write to log file ${filePath}: ${error.message}`);
    }
  }

  async getRequestLogs(): Promise<ApiRequestLog[]> {
    return [
      {
        path: 'graphql',
        method: 'POST',
        userId: 'user-123',
        requestBody: '{"query":"{\\n  users {\\n    id\\n  }\\n}"}',
        timestamp: new Date(),
      }
    ];
  }

  async getErrorLogs(): Promise<ApiErrorLog[]> {
    return [
      {
        path: 'graphql',
        statusCode: 400,
        errorMessage: 'Invalid query syntax',
        timestamp: new Date(),
      }
    ];
  }
} 