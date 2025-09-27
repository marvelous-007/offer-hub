import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

/**
 * Enum representing the type of entity for matching
 * @description Used to specify whether we're matching a freelancer to projects or a project to freelancers
 */
export enum MatchEntityType {
  FREELANCER = 'freelancer',
  PROJECT = 'project',
}

// Register the enum with GraphQL
registerEnumType(MatchEntityType, {
  name: 'MatchEntityType',
  description: 'Type of entity for matching (freelancer or project)',
});

/**
 * Interface for common match properties
 * @description Provides a base for different types of matches
 */
@ObjectType({ isAbstract: true })
export abstract class MatchBase {
  @Field(() => ID, { description: 'Unique identifier of the matched entity' })
  id: string;

  @Field(() => Float, { description: 'Similarity score (0-1) between the source and matched entity' })
  similarity: number;

  @Field(() => Float, { description: 'Normalized score (0-100) for ranking matches' })
  score: number;
}

/**
 * Match object returned from queries
 * @description Represents a match between a source entity and a target entity
 */
@ObjectType({ description: 'Match between a source entity and a target entity' })
export class MatchType extends MatchBase {
  @Field(() => String, { nullable: true, description: 'Explanation of why this match is relevant (only available with premium)' })
  explanation?: string;

  @Field(() => Float, { nullable: true, description: 'Adjusted score based on deeper analysis (only available with premium)' })
  adjustedScore?: number;
}

/**
 * Response object for match queries
 * @description Contains the list of matches and metadata about the request
 */
@ObjectType({ description: 'Response containing matches and request metadata' })
export class MatchResponseType {
  @Field(() => [MatchType], { description: 'List of matches found' })
  matches: MatchType[];

  @Field(() => Int, { description: 'Latency of the matching operation in milliseconds' })
  latencyMs: number;

  @Field(() => String, { description: 'Unique identifier for the match request' })
  requestId: string;
}

/**
 * Input type for match requests
 * @description Contains parameters for requesting matches
 */
@InputType({ description: 'Input parameters for requesting matches' })
export class MatchRequestInput {
  @Field(() => MatchEntityType, { description: 'Type of entity to match (freelancer or project)' })
  type: MatchEntityType;

  @Field(() => ID, { description: 'ID of the entity to find matches for' })
  id: string;

  @Field(() => String, { nullable: true, description: 'Optional text to use for matching instead of stored embeddings' })
  text?: string;

  @Field(() => Int, { nullable: true, defaultValue: 50, description: 'Maximum number of matches to return' })
  limit?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false, description: 'Whether to use premium matching with enhanced results' })
  usePremium?: boolean;
}
