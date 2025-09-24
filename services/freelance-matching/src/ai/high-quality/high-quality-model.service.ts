import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

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
}
