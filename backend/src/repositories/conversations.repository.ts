import { EntityRepository, Repository } from 'typeorm';
import { Conversation } from '@/entities/conversations.entity';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}