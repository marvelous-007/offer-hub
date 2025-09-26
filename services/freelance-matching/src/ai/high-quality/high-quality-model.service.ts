import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { Match } from '../../match/match.service';

export interface PromptChainInput {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface PromptChainResult {
  output: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  modelName: string;
  latencyMs: number;
}

export interface RefinedMatch extends Match {
  explanation: string;
  adjustedScore: number;
}

export interface RefinementRequest {
  sourceType: 'freelancer' | 'project';
  sourceId: string;
  sourceInfo?: any;
  matches: Match[];
  limit?: number;
}

export interface RefinementResponse {
  matches: RefinedMatch[];
  latencyMs: number;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class HighQualityModelService {
  private readonly logger = new Logger(HighQualityModelService.name);
  private readonly openAIModel: ChatOpenAI;
  private readonly defaultModel = 'gpt-4o';
  private readonly defaultMaxTokens = 2048;
  private readonly defaultTemperature = 0.7;

  constructor(private readonly configService: ConfigService) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      this.logger.error('OPENAI_API_KEY is not defined in environment variables');
      throw new Error('OPENAI_API_KEY is required for HighQualityModelService');
    }
    
    this.openAIModel = new ChatOpenAI({
      modelName: this.defaultModel,
      openAIApiKey: openaiApiKey,
      temperature: this.defaultTemperature,
      maxTokens: this.defaultMaxTokens,
    });
  }

  /**
   * Executes a prompt chain using LangChain and OpenAI
   * @param input The prompt chain input containing system and user prompts
   * @returns The result of the prompt chain execution
   */
  async executePromptChain(input: PromptChainInput): Promise<PromptChainResult> {
    const startTime = performance.now();
    
    try {
      this.logger.log(`Executing prompt chain with model: ${this.defaultModel}`);
      
      // Configure the model with input parameters
      const model = this.openAIModel.bind({
        maxTokens: input.maxTokens || this.defaultMaxTokens,
        temperature: input.temperature ?? this.defaultTemperature,
      });
      
      // Create the prompt template
      const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(input.systemPrompt),
        HumanMessagePromptTemplate.fromTemplate(input.userPrompt),
      ]);
      
      // Create the chain
      const chain = RunnableSequence.from([
        chatPrompt,
        model,
        new StringOutputParser(),
      ]);
      
      // Check token limit before execution
      const estimatedTokenCount = this.estimateTokenCount(input.systemPrompt + input.userPrompt);
      const maxAllowedTokens = 8192; // GPT-4o context window
      
      if (estimatedTokenCount > maxAllowedTokens * 0.8) {
        throw new Error(`Estimated token count (${estimatedTokenCount}) exceeds 80% of the model's context window`);
      }
      
      // Execute the chain
      const response = await chain.invoke({});
      
      // Get token usage from the last call
      const tokenUsage = await this.getTokenUsage();
      
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      
      this.logger.log(`Prompt chain executed in ${latencyMs.toFixed(2)}ms, used ${tokenUsage.totalTokens} tokens`);
      
      return {
        output: response,
        tokenUsage,
        modelName: this.defaultModel,
        latencyMs,
      };
    } catch (error) {
      this.logger.error(`Error executing prompt chain: ${error.message}`, error.stack);
      throw new Error(`Failed to execute prompt chain: ${error.message}`);
    }
  }

  /**
   * Estimates the token count for a given text
   * This is a simple approximation, not an exact count
   * @param text The text to estimate tokens for
   * @returns Estimated token count
   */
  private estimateTokenCount(text: string): number {
    // A simple approximation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Gets the token usage from the last OpenAI call
   * @returns Token usage statistics
   */
  private async getTokenUsage(): Promise<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }> {
    try {
      // In a real implementation, we would get this from the OpenAI response
      // For now, we'll return estimated values
      return {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      };
    } catch (error) {
      this.logger.warn(`Could not get token usage: ${error.message}`);
      return {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      };
    }
  }

  /**
   * Refines matches using the high-quality model to provide better ranking and explanations
   * @param request The refinement request containing source info and pre-filtered matches
   * @returns Refined matches with explanations and adjusted scores
   */
  async refineMatches(request: RefinementRequest): Promise<RefinementResponse> {
    const startTime = performance.now();
    const { sourceType, sourceId, sourceInfo, matches, limit = 10 } = request;
    
    try {
      this.logger.log(`Refining ${matches.length} matches for ${sourceType} with ID ${sourceId}`);
      
      // Limit the number of matches to refine to save tokens
      const matchesToRefine = matches.slice(0, Math.min(matches.length, limit));
      
      // Prepare the source information and matches for the prompt
      const sourceDescription = sourceInfo ? 
        JSON.stringify(sourceInfo, null, 2) : 
        `${sourceType} with ID ${sourceId}`;
      
      const matchesDescription = matchesToRefine.map(match => (
        `{ "id": "${match.id}", "similarity": ${match.similarity}, "score": ${match.score} }`
      )).join(',\n');
      
      // Create system prompt for refinement
      const systemPrompt = `You are an expert matching system that refines and ranks matches between freelancers and projects.
      Your task is to analyze the provided matches and improve their ranking based on deeper reasoning.
      
      You MUST return your response as a valid JSON array of objects with the following structure:
      [
        {
          "id": "the original ID of the match",
          "similarity": the original similarity score (0-1),
          "score": the original score (0-100),
          "adjustedScore": a new score (0-100) based on your analysis,
          "explanation": "a brief explanation of why this match is good or bad"
        },
        ...
      ]
      
      Sort the results by adjustedScore in descending order (highest score first).
      Focus on providing meaningful explanations that highlight strengths or weaknesses of each match.`;
      
      // Create user prompt with the source and matches information
      const userPrompt = `Source: ${sourceDescription}\n\nMatches to refine:\n[${matchesDescription}]\n\nPlease analyze these matches and provide refined rankings with explanations.`;
      
      // Execute the prompt chain
      const chainResult = await this.executePromptChain({
        systemPrompt,
        userPrompt,
        temperature: 0.3, // Lower temperature for more consistent results
      });
      
      // Parse the JSON response
      let refinedMatches: RefinedMatch[] = [];
      
      try {
        const parsedResponse = JSON.parse(chainResult.output);
        
        if (!Array.isArray(parsedResponse)) {
          throw new Error('Model did not return an array');
        }
        
        // Validate and transform the response
        refinedMatches = parsedResponse.map(match => {
          // Ensure all required fields are present
          if (!match.id || typeof match.adjustedScore !== 'number' || !match.explanation) {
            this.logger.warn(`Invalid match in response: ${JSON.stringify(match)}`);
          }
          
          return {
            id: match.id || '',
            similarity: match.similarity || 0,
            score: match.score || 0,
            adjustedScore: match.adjustedScore || 0,
            explanation: match.explanation || 'No explanation provided',
          };
        });
        
        // Sort by adjustedScore (descending)
        refinedMatches.sort((a, b) => b.adjustedScore - a.adjustedScore);
        
      } catch (parseError) {
        this.logger.error(`Error parsing model response: ${parseError.message}`);
        
        // Fallback: If JSON parsing fails, use the original matches with default explanations
        refinedMatches = matchesToRefine.map(match => ({
          ...match,
          adjustedScore: match.score,
          explanation: 'Could not generate explanation due to parsing error',
        }));
      }
      
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      
      this.logger.log(`Refinement completed in ${latencyMs.toFixed(2)}ms, refined ${refinedMatches.length} matches`);
      
      return {
        matches: refinedMatches,
        latencyMs,
        tokenUsage: chainResult.tokenUsage,
      };
      
    } catch (error) {
      this.logger.error(`Error refining matches: ${error.message}`, error.stack);
      throw new Error(`Failed to refine matches: ${error.message}`);
    }
  }
}
