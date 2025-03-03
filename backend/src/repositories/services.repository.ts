import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '@/entities/services.entity';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>
  ) {}

  async create(serviceData: Partial<Service>): Promise<Service> {
    const service = this.repository.create(serviceData);
    return await this.repository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.repository.find({
      relations: ['freelancer']
    });
  }

  async findById(id: string): Promise<Service | null> {
    return await this.repository.findOne({ 
      where: { service_id: id },
      relations: ['freelancer']
    });
  }

  async findByFreelancerId(freelancerId: string): Promise<Service[]> {
    return await this.repository.find({ 
      where: { freelancer_id: freelancerId },
      relations: ['freelancer']
    });
  }

  async findActive(): Promise<Service[]> {
    return await this.repository.find({ 
      where: { is_active: true },
      relations: ['freelancer']
    });
  }

  async update(id: string, serviceData: Partial<Service>): Promise<Service> {
    await this.repository.update(id, serviceData);
    return this.findById(id) as Promise<Service>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}