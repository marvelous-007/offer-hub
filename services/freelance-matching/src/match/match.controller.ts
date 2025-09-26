import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MatchService, MatchRequest, MatchResponse } from './match.service';

@Controller('match')
export class MatchController {
  private readonly logger = new Logger(MatchController.name);

  constructor(private readonly matchService: MatchService) {}

  /**
   * Get matches based on the request
   * @param request The match request containing type, ID, and optional parameters
   * @returns A response with matches, latency, and request ID
   */
  @Post('get-matches')
  async getMatches(@Body() request: MatchRequest): Promise<MatchResponse> {
    try {
      this.logger.log(`Received match request for ${request.type} with ID ${request.id}`);
      
      // Validate request
      if (!request.type || !request.id) {
        throw new HttpException('Missing required fields: type and id', HttpStatus.BAD_REQUEST);
      }
      
      if (request.type !== 'freelancer' && request.type !== 'project') {
        throw new HttpException('Type must be either "freelancer" or "project"', HttpStatus.BAD_REQUEST);
      }
      
      return await this.matchService.getMatches(request);
    } catch (error) {
      this.logger.error(`Error in match controller: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Failed to get matches: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
