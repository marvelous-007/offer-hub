import { EntityRepository, Repository } from 'typeorm';
import { Message } from '@/entities/messages.entity';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {}
