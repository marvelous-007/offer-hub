import { Args, Query, Resolver } from '@nestjs/graphql';
import { MatchRequestInput, MatchResponseType } from './match.types';
import { MatchService } from '../../match/match.service';

@Resolver(() => MatchResponseType)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  /**
   * GraphQL query to get matches based on the provided request parameters
   * @param matchRequest The input parameters for the match request
   * @returns A response containing matches and request metadata
   */
  @Query(() => MatchResponseType, {
    name: 'getMatches',
    description: 'Get matches for a freelancer or project',
  })
  async getMatches(
    @Args('matchRequest', { type: () => MatchRequestInput })
    matchRequest: MatchRequestInput,
  ): Promise<MatchResponseType> {
    // Convert GraphQL input to service request format
    const serviceRequest = {
      type: matchRequest.type,
      id: matchRequest.id,
      text: matchRequest.text,
      limit: matchRequest.limit,
    };

    // Call the match service to get matches
    return this.matchService.getMatches(serviceRequest);
  }
}
