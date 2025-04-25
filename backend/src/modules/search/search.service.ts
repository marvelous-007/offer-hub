import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  [key: string]: any;
}

export interface UserSearchResult {
  id: string;
  username: string;
  email: string;
  wallet_address: string;
  [key: string]: any;
}

export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly serviceIndexName = 'services';
  private readonly userIndexName = 'users';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async createIndices() {
    try {
      // Create services index if it doesn't exist
      const serviceIndexExists = await this.elasticsearchService.indices.exists({
        index: this.serviceIndexName,
      });

      if (!serviceIndexExists) {
        await this.elasticsearchService.indices.create({
          index: this.serviceIndexName,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
                description: { type: 'text' },
                price: { type: 'float' },
                category: { type: 'keyword' },
                tags: { type: 'keyword' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' },
              },
            },
          },
        });
        this.logger.log(`Index ${this.serviceIndexName} created successfully`);
      }

      // Create users index if it doesn't exist
      const userIndexExists = await this.elasticsearchService.indices.exists({
        index: this.userIndexName,
      });

      if (!userIndexExists) {
        await this.elasticsearchService.indices.create({
          index: this.userIndexName,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                username: { type: 'text' },
                email: { type: 'keyword' },
                wallet_address: { type: 'keyword' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' },
              },
            },
          },
        });
        this.logger.log(`Index ${this.userIndexName} created successfully`);
      }
    } catch (error) {
      this.logger.error(`Failed to create indices: ${error.message}`, error.stack);
      throw error;
    }
  }

  async indexService(service: any) {
    try {
      await this.elasticsearchService.index({
        index: this.serviceIndexName,
        id: service.id,
        body: {
          ...service,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      this.logger.log(`Service ${service.id} indexed successfully`);
    } catch (error) {
      this.logger.error(`Failed to index service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchServices(query: string, filters?: any) {
    try {
      const searchQuery = {
        index: this.serviceIndexName,
        body: {
      query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: ['name^3', 'description'],
                    fuzziness: 'AUTO',
                  },
                },
              ],
              filter: filters ? Object.entries(filters).map(([field, value]) => ({
                term: { [field]: value },
              })) : [],
            },
          },
        },
      };

      const result = await this.elasticsearchService.search(searchQuery);
      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      this.logger.error(`Failed to search services: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateService(id: string, service: any) {
    try {
      await this.elasticsearchService.update({
        index: this.serviceIndexName,
        id,
        body: {
          doc: {
            ...service,
            updatedAt: new Date(),
          },
        },
      });
      this.logger.log(`Service ${id} updated successfully`);
    } catch (error) {
      this.logger.error(`Failed to update service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteService(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: this.serviceIndexName,
        id,
      });
      this.logger.log(`Service ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async search(params: SearchParams) {
    try {
      this.logger.log(`Searching services with params: ${JSON.stringify(params)}`);
      const {
        query,
        category,
        minPrice,
        maxPrice,
        minRating,
        page = 1,
        limit = 10,
        sortBy = 'rating',
        sortOrder = 'desc',
      } = params;

      const must: any[] = [];
      const should: any[] = [];

      if (query) {
        should.push(
          {
            match: {
              name: {
                query,
                boost: 2,
              },
            },
          },
          {
            match: {
              description: {
                query,
                boost: 1,
              },
            },
          },
        );
      }

      if (category) {
        must.push({
          term: {
            category,
          },
        });
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        const range: any = {};
        if (minPrice !== undefined) range.gte = minPrice;
        if (maxPrice !== undefined) range.lte = maxPrice;
        must.push({
          range: {
            price: range,
          },
        });
      }

      if (minRating !== undefined) {
        must.push({
          range: {
            rating: {
              gte: minRating,
            },
      },
    });
      }

      const searchQuery = {
        index: this.serviceIndexName,
        body: {
          query: {
            bool: {
              must,
              should,
              minimum_should_match: query ? 1 : 0,
            },
          },
          sort: [
            {
              [sortBy]: {
                order: sortOrder,
              },
            },
          ],
          from: (page - 1) * limit,
          size: limit,
        },
      };

      const response = await this.elasticsearchService.search(searchQuery);
      const total = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : response.hits.total?.value || 0;
      const hits = response.hits.hits;

      this.logger.log(`Search completed. Found ${total} results`);
      return {
        total,
        items: hits.map((hit: any) => ({
          id: hit._id,
          ...hit._source,
        })),
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`, error.stack);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async indexUser(user: any) {
    try {
      await this.elasticsearchService.index({
        index: this.userIndexName,
        id: user.id,
        body: {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      this.logger.log(`User ${user.id} indexed successfully`);
    } catch (error) {
      this.logger.error(`Failed to index user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateUser(id: string, user: any) {
    try {
      await this.elasticsearchService.update({
        index: this.userIndexName,
        id,
        body: {
          doc: {
            ...user,
            updatedAt: new Date(),
          },
        },
      });
      this.logger.log(`User ${id} updated successfully`);
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: this.userIndexName,
        id,
      });
      this.logger.log(`User ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchUsers(params: UserSearchParams) {
    try {
      this.logger.log(`Searching users with params: ${JSON.stringify(params)}`);
      const {
        query,
        page = 1,
        limit = 10,
        sortBy = 'username',
        sortOrder = 'asc',
      } = params;

      const must: any[] = [];
      const should: any[] = [];

      if (query) {
        should.push(
          {
            match: {
              username: {
                query,
                boost: 2,
              },
            },
          },
          {
            match: {
              email: {
                query,
                boost: 1,
              },
            },
          },
        );
      }

      const searchQuery = {
        index: this.userIndexName,
        body: {
          query: {
            bool: {
              must,
              should,
              minimum_should_match: query ? 1 : 0,
            },
          },
          sort: [
            {
              [sortBy]: {
                order: sortOrder,
              },
            },
          ],
          from: (page - 1) * limit,
          size: limit,
        },
      };

      const response = await this.elasticsearchService.search(searchQuery);
      const total = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : response.hits.total?.value || 0;
      const hits = response.hits.hits;

      this.logger.log(`User search completed. Found ${total} results`);
      return {
        total,
        items: hits.map((hit: any) => ({
          ...hit._source,
          id: hit._id,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to search users: ${error.message}`, error.stack);
      throw error;
    }
  }
}
