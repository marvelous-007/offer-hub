import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LowCostModelService } from './low-cost-model.service';

@Module({
  imports: [ConfigModule],
  providers: [LowCostModelService],
  exports: [LowCostModelService],
})
export class AiModule {}
