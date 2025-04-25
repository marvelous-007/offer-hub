import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

describe('SearchService', () => {
  let service: SearchService;
  let elasticsearchService: ElasticsearchService;

  const mockElasticsearchService = {
    indices: {
      exists: jest.fn(),
      create: jest.fn(),
    },
    index: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'ELASTICSEARCH_HOST':
          return 'localhost';
        case 'ELASTICSEARCH_PORT':
          return '9200';
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ElasticsearchService,
          useValue: mockElasticsearchService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    elasticsearchService = module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIndices', () => {
    it('should create index if it does not exist', async () => {
      mockElasticsearchService.indices.exists.mockResolvedValue(false);
      await service.createIndices();
      expect(mockElasticsearchService.indices.create).toHaveBeenCalledWith({
        index: 'services',
        body: {
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'english' },
              description: { type: 'text', analyzer: 'english' },
              category: { type: 'keyword' },
              price: { type: 'float' },
              rating: { type: 'float' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
    });

    it('should not create index if it exists', async () => {
      mockElasticsearchService.indices.exists.mockResolvedValue(true);
      await service.createIndices();
      expect(mockElasticsearchService.indices.create).not.toHaveBeenCalled();
    });
  });

  describe('indexService', () => {
    it('should index a service', async () => {
      const serviceData = {
        id: '1',
        name: 'Test Service',
        description: 'Test Description',
        category: 'Test Category',
        price: 100,
        rating: 4.5,
        createdAt: new Date(),
      };

      await service.indexService(serviceData);
      expect(mockElasticsearchService.index).toHaveBeenCalledWith({
        index: 'services',
        id: serviceData.id,
        body: expect.objectContaining({
          name: serviceData.name,
          description: serviceData.description,
          category: serviceData.category,
          price: serviceData.price,
          rating: serviceData.rating,
        }),
      });
    });
  });

  describe('search', () => {
    it('should search services with filters', async () => {
      const mockSearchResponse = {
        hits: {
          total: { value: 1 },
          hits: [
            {
              _id: '1',
              _source: {
                name: 'Test Service',
                description: 'Test Description',
                category: 'Test Category',
                price: 100,
                rating: 4.5,
              },
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValue(mockSearchResponse);

      const searchParams = {
        query: 'test',
        category: 'Test Category',
        minPrice: 50,
        maxPrice: 150,
        minRating: 4,
        page: 1,
        limit: 10,
      };

      const result = await service.search(searchParams);

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: '1',
            name: 'Test Service',
            description: 'Test Description',
            category: 'Test Category',
            price: 100,
            rating: 4.5,
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      expect(mockElasticsearchService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 'services',
          body: expect.objectContaining({
            query: expect.any(Object),
            sort: expect.any(Array),
            from: 0,
            size: 10,
          }),
        }),
      );
    });
  });
}); 