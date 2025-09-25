import { Module } from '@nestjs/common';
import { HealthResolver } from './resolvers/health.resolver';
import { MatchResolver } from './matches/match.resolver';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [MatchModule],
  providers: [HealthResolver, MatchResolver],
})
export class GraphQLAppModule {}
