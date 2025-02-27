import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '@/entities/services.entity';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repo: Repository<Service>,
  ) {}

  async create(data: Partial<Service>): Promise<Service> {
    const service = this.repo.create(data);
    return this.repo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.repo.find();
  }

  async findById(service_id: string): Promise<Service | null> {
    return this.repo.findOne({ where: { service_id } });
  }

  async findByFreelancerId(freelancer_id: string): Promise<Service[]> {
    return this.repo.find({ where: { freelancer_id } });
  }

  async update(service_id: string, data: Partial<Service>): Promise<Service> {
    const service = await this.findById(service_id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${service_id} not found`);
    }
    await this.repo.update(service_id, data);
    return this.findById(service_id) as Promise<Service>;
  }

  async delete(service_id: string): Promise<void> {
    const result = await this.repo.delete(service_id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${service_id} not found`);
    }
  }
}