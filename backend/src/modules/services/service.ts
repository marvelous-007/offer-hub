import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entity';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { WebhooksService } from "../webhooks/service";
import { WebhookEvent } from '../webhooks/entity';
import { SearchService } from '../search/search.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly webhooksService: WebhooksService,
    private readonly searchService: SearchService,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    const savedService = await this.serviceRepository.save(service);
    
    // Index the service in ElasticSearch
    await this.searchService.indexService(savedService);
    
    // Webhook trigger
    const webhookData = {
      event: WebhookEvent.SERVICE_BOOKED, 
      data: {
        savedService
      }
    };
  
    await this.webhooksService.triggerWebhook(webhookData);
  
    return savedService;
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({ relations: ["freelancer"] });
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { service_id: id },
      relations: ["freelancer"],
    });
    if (!service)
      throw new NotFoundException(`Service with ID ${id} not found.`);
    return service;
  }

  async findByFreelancer(freelancerId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { freelancer_id: freelancerId },
      relations: ["freelancer"],
    });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    Object.assign(service, updateServiceDto);
    const updatedService = await this.serviceRepository.save(service);
    
    // Update the service in ElasticSearch
    await this.searchService.updateService(id, updatedService);
    
    return updatedService;
  }

  async delete(id: string): Promise<void> {
    const service = await this.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    await this.serviceRepository.remove(service);
    
    // Remove the service from ElasticSearch
    await this.searchService.deleteService(id);
  }
}
