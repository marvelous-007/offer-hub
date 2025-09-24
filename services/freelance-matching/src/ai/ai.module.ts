import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LowCostModelService } from './low-cost-model.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [LowCostModelService],
  exports: [LowCostModelService],
})
export class AiModule {}
