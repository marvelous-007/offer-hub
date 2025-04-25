import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchServices', () => {
    it('should return search results', async () => {
      const mockSearchResult = {
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
      };

      mockSearchService.search.mockResolvedValue(mockSearchResult);

      const queryParams = {
        query: 'test',
        category: 'Test Category',
        minPrice: 50,
        maxPrice: 150,
        minRating: 4,
        page: 1,
        limit: 10,
      };

      const result = await controller.searchServices(queryParams);

      expect(result).toEqual(mockSearchResult);
      expect(mockSearchService.search).toHaveBeenCalledWith(queryParams);
    });

    it('should handle empty search parameters', async () => {
      const mockSearchResult = {
        total: 0,
        items: [],
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockSearchService.search.mockResolvedValue(mockSearchResult);

      const result = await controller.searchServices({});

      expect(result).toEqual(mockSearchResult);
      expect(mockSearchService.search).toHaveBeenCalledWith({});
    });
  });
}); 