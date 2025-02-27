import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ServicesService } from '@/services/services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '@/dtos/services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    return await this.servicesService.create(createServiceDto);
  }

  @Get()
  async findAll(@Query('freelancer_id') freelancer_id?: string): Promise<ServiceResponseDto[]> {
    if (freelancer_id) {
      return await this.servicesService.findByFreelancer(freelancer_id);
    }
    return await this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return await this.servicesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return await this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.servicesService.remove(id);
  }
}

export default ServicesController;