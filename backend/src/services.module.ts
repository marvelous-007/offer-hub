import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@/entities/services.entity';
import { ServicesRepository } from '@/repositories/services.repository';
import { ServicesService } from '@/services/services.service';
import { ServicesController } from '@/controllers/services.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServicesRepository, ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}