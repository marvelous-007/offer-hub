import { Injectable, Logger } from '@nestjs/common';
import { LowCostModelService } from '../ai/low-cost-model.service';
import { PrismaService } from '../prisma/prisma.service';

export interface MatchRequest {
  type: 'freelancer' | 'project';
  id: string;
  text?: string;
  limit?: number;
}

export interface Match {
  id: string;
  similarity: number;
  score: number;
}

export interface MatchResponse {
  matches: Match[];
  latencyMs: number;
  requestId: string;
}

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    private readonly lowCostModelService: LowCostModelService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get matches based on the request type and ID
   * @param request The match request containing type, ID, and optional parameters
   * @returns A response with matches, latency, and request ID
   */
  async getMatches(request: MatchRequest): Promise<MatchResponse> {
    const { type, id, text, limit = 50 } = request;
    const requestId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    this.logger.log(`Processing match request ${requestId} for ${type} with ID ${id}`);
    
    try {
      // Get the embedding for the source item
      let embedding: number[];
      
      if (text) {
        // If text is provided, generate embedding from it
        embedding = await this.lowCostModelService.generateEmbedding(text);
      } else {
        // Otherwise, fetch the embedding from the database
        const tableName = type === 'freelancer' ? 'FreelancerEmbedding' : 'ProjectEmbedding';
        const idField = type === 'freelancer' ? 'userId' : 'projectId';
        
        const query = `
          SELECT embedding
          FROM "${tableName}"
          WHERE "${idField}" = $1
        `;
        
        const result = await this.prisma.$queryRawUnsafe(query, id);
        
        if (!result || result.length === 0) {
          throw new Error(`No embedding found for ${type} with ID ${id}`);
        }
        
        embedding = result[0].embedding;
      }
      
      // Get the opposite type for matching
      const matchType = type === 'freelancer' ? 'project' : 'freelancer';
      
      // Use pre-filter to get initial matches
      const preFilterResults = await this.lowCostModelService.preFilter(embedding, matchType, limit);
      
      // Transform results to match the expected format
      const matches: Match[] = preFilterResults.map(result => ({
        id: result.id,
        similarity: result.similarity,
        score: result.similarity * 100, // Convert similarity to a 0-100 score
      }));
      
      return {
        matches,
        latencyMs: preFilterResults[0]?.latencyMs || 0,
        requestId,
      };
    } catch (error) {
      this.logger.error(`Error in match service: ${error.message}`, error.stack);
      throw new Error(`Failed to get matches: ${error.message}`);
    }
  }
}
