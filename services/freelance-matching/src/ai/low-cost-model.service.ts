import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { performance } from 'perf_hooks';

@Injectable()
export class LowCostModelService {
  private readonly logger = new Logger(LowCostModelService.name);
  private readonly hf: HfInference;
  private readonly defaultModel = 'sentence-transformers/all-MiniLM-L6-v2';

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const hfApiKey = this.configService.get<string>('HF_API_KEY');
    this.hf = new HfInference(hfApiKey);
  }

  /**
   * Generate embedding vector from text input using Hugging Face
   * @param text The input text to generate embeddings for
   * @returns A vector of numbers representing the text embedding
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      this.logger.log(`Generating embedding for text of length ${text.length}`);
      
      // Use the feature-extraction task to get embeddings
      const result = await this.hf.featureExtraction({
        model: this.defaultModel,
        inputs: text,
      });

      // Handle different response formats from Hugging Face
      if (Array.isArray(result)) {
        return result as number[];
      } else if (typeof result === 'object') {
        // Some models return nested arrays or objects with data property
        const data = result as any;
        if (data && Array.isArray(data.data)) {
          return data.data as number[];
        }
      }
      
      // If we can't extract a proper array, throw an error
      throw new Error('Unexpected response format from Hugging Face API');
    } catch (error) {
      this.logger.error(`Error generating embedding: ${error.message}`, error.stack);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param vecA First vector
   * @param vecB Second vector
   * @returns Similarity score between 0 and 1
   */
  calculateSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    // Calculate dot product
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    
    // Calculate magnitudes
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    
    // Calculate cosine similarity
    return dotProduct / (magA * magB);
  }

  /**
   * Pre-filter candidates using cosine similarity on embeddings
   * @param embedding The query embedding vector
   * @param type The type of embedding to search ('freelancer' or 'project')
   * @param limit Maximum number of results to return
   * @returns Array of candidates sorted by similarity
   */
  async preFilter(
    embedding: number[], 
    type: 'freelancer' | 'project', 
    limit: number = 50
  ): Promise<{ id: string; similarity: number; latencyMs: number }[]> {
    const startTime = performance.now();
    this.logger.log(`Starting pre-filter for ${type} with limit ${limit}`);
    
    try {
      // Convert embedding array to PostgreSQL vector format
      const vectorString = `[${embedding.join(',')}]`;
      
      // Determine which table to query based on type
      const tableName = type === 'freelancer' ? 'FreelancerEmbedding' : 'ProjectEmbedding';
      const idField = type === 'freelancer' ? 'userId' : 'projectId';
      
      // Use raw SQL with pgvector's <-> operator for cosine distance
      // Note: <-> returns distance (smaller is better), so we negate it for similarity
      const query = `
        SELECT 
          "${idField}" as id, 
          1 - (embedding <-> $1::vector) as similarity
        FROM "${tableName}"
        ORDER BY similarity DESC
        LIMIT $2
      `;
      
      const results = await this.prisma.$queryRawUnsafe(query, vectorString, limit);
      
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      
      this.logger.log(`Pre-filter completed in ${latencyMs.toFixed(2)}ms, found ${results.length} results`);
      
      // Add latency information to the result
      return results.map(result => ({
        ...result,
        latencyMs
      }));
    } catch (error) {
      this.logger.error(`Error in pre-filter: ${error.message}`, error.stack);
      throw new Error(`Failed to pre-filter candidates: ${error.message}`);
    }
  }
}
