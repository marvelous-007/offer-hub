import { Module } from '@nestjs/common';
import { LogsController } from './controller';
import { LogsService } from './service';
import { GatewayLogService } from './gateway-log.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, GatewayLogService],
  exports: [GatewayLogService],
})
export class LogsModule {} 