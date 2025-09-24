import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LowCostModelService {
  private readonly logger = new Logger(LowCostModelService.name);
  private readonly hf: HfInference;
  private readonly defaultModel = 'sentence-transformers/all-MiniLM-L6-v2';

  constructor(private readonly configService: ConfigService) {
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
}
