import 'reflect-metadata';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RatingsService } from '../services/ratings.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateRatingDto, UpdateRatingDto } from '../dtos/ratings.dto';
import type { RatingResponseDto } from '../dtos/ratings.dto';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto): Promise<RatingResponseDto> {
    return await this.ratingsService.create(createRatingDto);
  }

  @Get()
  async findAll(): Promise<RatingResponseDto[]> {
    return await this.ratingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RatingResponseDto> {
    return await this.ratingsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    return await this.ratingsService.update(id, updateRatingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ratingsService.remove(id);
  }
} 