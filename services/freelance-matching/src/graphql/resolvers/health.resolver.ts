import { Query, Resolver } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HealthCheck {
  @Field()
  status: string;

  @Field()
  timestamp: string;

  @Field()
  message: string;

  @Field()
  version: string;
}

@Resolver(() => HealthCheck)
export class HealthResolver {
  @Query(() => HealthCheck)
  health(): HealthCheck {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'GraphQL API is operational',
      version: '1.0.0',
    };
  }
}
