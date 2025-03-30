import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsService } from './service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiRequestLog, ApiErrorLog } from './types';

@ApiTags('logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  @ApiOperation({ summary: 'Get all API request logs' })
  @ApiResponse({ status: 200, description: 'Return all API request logs' })
  async getRequestLogs(): Promise<ApiRequestLog[]> {
    return this.logsService.getRequestLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('errors')
  @ApiOperation({ summary: 'Get all API error logs' })
  @ApiResponse({ status: 200, description: 'Return all API error logs' })
  async getErrorLogs(): Promise<ApiErrorLog[]> {
    return this.logsService.getErrorLogs();
  }
} 