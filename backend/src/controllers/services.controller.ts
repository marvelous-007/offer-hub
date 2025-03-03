import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ServicesService } from '@/services/services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '@/dtos/services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  async findAll(@Query('active') active?: string): Promise<ServiceResponseDto[]> {
    if (active === 'true') {
      return this.servicesService.findActive();
    }
    return this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findById(id);
  }

  @Get('freelancer/:freelancerId')
  async findByFreelancer(@Param('freelancerId') freelancerId: string): Promise<ServiceResponseDto[]> {
    return this.servicesService.findByFreelancerId(freelancerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.servicesService.delete(id);
  }
}