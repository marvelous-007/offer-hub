import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { MatchModule } from '../match.module';
import { LowCostModelService } from '../../ai/low-cost-model.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('Match Integration Tests', () => {
  let app: INestApplication;
  let lowCostModelService: LowCostModelService;
  let prismaService: PrismaService;

  // Mock data
  const mockEmbedding = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
  const mockMatches = Array(10).fill(0).map((_, i) => ({
    id: `match-${i}`,
    similarity: 0.9 - (i * 0.05),
    latencyMs: 25,
  }));

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MatchModule,
      ],
    })
      .overrideProvider(LowCostModelService)
      .useValue({
        generateEmbedding: jest.fn().mockResolvedValue(mockEmbedding),
        preFilter: jest.fn().mockResolvedValue(mockMatches),
      })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRawUnsafe: jest.fn().mockImplementation((query, id) => {
          if (query.includes('SELECT embedding')) {
            return Promise.resolve([{ embedding: mockEmbedding }]);
          }
          return Promise.resolve([]);
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    lowCostModelService = moduleFixture.get<LowCostModelService>(LowCostModelService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /match/get-matches', () => {
    it('should return matches for a freelancer', async () => {
      const response = await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'freelancer',
          id: 'user-123',
        })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('matches');
      expect(response.body).toHaveProperty('latencyMs');
      expect(response.body).toHaveProperty('requestId');
      expect(response.body.matches).toBeInstanceOf(Array);
      expect(response.body.matches.length).toBeGreaterThan(0);
      
      // Verify each match has the expected structure
      response.body.matches.forEach(match => {
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('similarity');
        expect(match).toHaveProperty('score');
        expect(typeof match.score).toBe('number');
      });
      
      // Verify matches are sorted by similarity (descending)
      const similarities = response.body.matches.map(m => m.similarity);
      const sortedSimilarities = [...similarities].sort((a, b) => b - a);
      expect(similarities).toEqual(sortedSimilarities);
    });

    it('should return matches for a project', async () => {
      const response = await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'project',
          id: 'project-456',
        })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('matches');
      expect(response.body.matches.length).toBeGreaterThan(0);
    });

    it('should generate embedding from text if provided', async () => {
      await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'freelancer',
          id: 'user-123',
          text: 'Sample project description for matching',
        })
        .expect(HttpStatus.OK);

      expect(lowCostModelService.generateEmbedding).toHaveBeenCalledWith('Sample project description for matching');
    });

    it('should return 400 for invalid request type', async () => {
      await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'invalid',
          id: 'user-123',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'freelancer',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(prismaService, '$queryRawUnsafe').mockRejectedValueOnce(new Error('Database error'));

      await request(app.getHttpServer())
        .post('/match/get-matches')
        .send({
          type: 'freelancer',
          id: 'user-123',
        })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
