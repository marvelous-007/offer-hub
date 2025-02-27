import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from '@/repositories/services.repository';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '@/dtos/services.dto';
import { Service } from '@/entities/services.entity';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.create(createServiceDto);
    return this.mapServiceToDto(service);
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.servicesRepository.findAll();
    return services.map(service => this.mapServiceToDto(service));
  }

  async findOne(service_id: string): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.findById(service_id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${service_id} not found`);
    }
    return this.mapServiceToDto(service);
  }

  async findByFreelancer(freelancer_id: string): Promise<ServiceResponseDto[]> {
    const services = await this.servicesRepository.findByFreelancerId(freelancer_id);
    return services.map(service => this.mapServiceToDto(service));
  }

  async update(service_id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.update(service_id, updateServiceDto);
    return this.mapServiceToDto(service);
  }

  async remove(service_id: string): Promise<void> {
    return this.servicesRepository.delete(service_id);
  }

  private mapServiceToDto(service: Service): ServiceResponseDto {
    return {
      service_id: service.service_id,
      freelancer_id: service.freelancer_id,
      title: service.title,
      description: service.description,
      base_price: service.base_price,
      delivery_time_days: service.delivery_time_days,
      is_active: service.is_active,
      created_at: service.created_at,
      updated_at: service.updated_at
    };
  }
}