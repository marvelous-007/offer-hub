import { Controller, Get, Post, Put, Delete, Query, Body, Param, ValidationPipe, UseGuards } from '@nestjs/common';
import { SearchService, SearchParams, UserSearchParams } from './search.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../logs/jwt-auth.guard'; 

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('create-index')
  @ApiOperation({ summary: 'Create the services index in Elasticsearch' })
  async createIndices() {
    return this.searchService.createIndices();
  }

  @Post('index')
  @ApiOperation({ summary: 'Index a service' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        price: { type: 'number' },
        rating: { type: 'number' },
      },
    },
  })
  async indexService(@Body() service: any) {
    return this.searchService.indexService(service);
  }

  @Get('services')
  @ApiOperation({ summary: 'Search services with filters' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)' })
  async searchServices(@Query() params: SearchParams) {
    return this.searchService.search(params);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an indexed service' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        price: { type: 'number' },
        rating: { type: 'number' },
      },
    },
  })
  async updateService(@Param('id') id: string, @Body() service: any) {
    return this.searchService.updateService(id, service);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a service from the index' })
  async deleteService(@Param('id') id: string) {
    return this.searchService.deleteService(id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query() params: UserSearchParams) {
    return this.searchService.searchUsers(params);
  }
} 