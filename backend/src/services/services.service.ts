import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from '@/repositories/services.repository';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '@/dtos/services.dto';
import { Service } from '@/entities/services.entity';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.create(createServiceDto);
    return this.mapToResponseDto(service);
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.servicesRepository.findAll();
    return services.map(service => this.mapToResponseDto(service));
  }

  async findById(id: string): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return this.mapToResponseDto(service);
  }

  async findByFreelancerId(freelancerId: string): Promise<ServiceResponseDto[]> {
    const services = await this.servicesRepository.findByFreelancerId(freelancerId);
    return services.map(service => this.mapToResponseDto(service));
  }

  async findActive(): Promise<ServiceResponseDto[]> {
    const services = await this.servicesRepository.findActive();
    return services.map(service => this.mapToResponseDto(service));
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const existingService = await this.servicesRepository.findById(id);
    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    
    const updatedService = await this.servicesRepository.update(id, updateServiceDto);
    return this.mapToResponseDto(updatedService);
  }

  async delete(id: string): Promise<void> {
    const existingService = await this.servicesRepository.findById(id);
    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    
    await this.servicesRepository.delete(id);
  }

  private mapToResponseDto(service: Service): ServiceResponseDto {
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