import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const logsDir = path.resolve(process.cwd(), 'logs');

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  async getRequestLogs(): Promise<any[]> {
    try {
      const filePath = path.join(logsDir, 'api-requests.log');
      
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`Log file not found: ${filePath}`);
        return [];
      }
      
      const content = await readFile(filePath, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            this.logger.error(`Failed to parse log entry: ${line}`);
            return null;
          }
        })
        .filter(entry => entry !== null);
    } catch (error) {
      this.logger.error(`Error reading request logs: ${error.message}`, error.stack);
      return [];
    }
  }

  async getErrorLogs(): Promise<any[]> {
    try {
      const filePath = path.join(logsDir, 'api-errors.log');
      
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`Log file not found: ${filePath}`);
        return [];
      }
      
      const content = await readFile(filePath, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            this.logger.error(`Failed to parse log entry: ${line}`);
            return null;
          }
        })
        .filter(entry => entry !== null);
    } catch (error) {
      this.logger.error(`Error reading error logs: ${error.message}`, error.stack);
      return [];
    }
  }

  async getResponseLogs(): Promise<any[]> {
    try {
      const filePath = path.join(logsDir, 'api-responses.log');
      
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`Log file not found: ${filePath}`);
        return [];
      }
      
      const content = await readFile(filePath, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            this.logger.error(`Failed to parse log entry: ${line}`);
            return null;
          }
        })
        .filter(entry => entry !== null);
    } catch (error) {
      this.logger.error(`Error reading response logs: ${error.message}`, error.stack);
      return [];
    }
  }
} 