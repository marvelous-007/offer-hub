import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@/entities/services.entity';
import { ServicesController } from '@/controllers/services.controller';
import { ServicesService } from '@/services/services.service';
import { ServicesRepository } from '@/repositories/services.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService]
})
export class ServicesModule {}