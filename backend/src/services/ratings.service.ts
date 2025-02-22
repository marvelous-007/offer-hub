import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/ratings.entity';
import type { CreateRatingDto, UpdateRatingDto } from '../dtos/ratings.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const rating = this.ratingsRepository.create(createRatingDto);
    return await this.ratingsRepository.save(rating);
  }

  async findAll(): Promise<Rating[]> {
    return await this.ratingsRepository.find({
      relations: ['fromUser', 'toUser', 'project'],
    });
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { rating_id: id },
      relations: ['fromUser', 'toUser', 'project'],
    });
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.findOne(id);
    Object.assign(rating, updateRatingDto);
    return await this.ratingsRepository.save(rating);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ratingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
  }
} 