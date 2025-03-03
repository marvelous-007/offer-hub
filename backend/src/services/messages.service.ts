/*import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesRepository } from '@/repositories/messages.repository';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/messages.dto';
import { Message } from '@/entities/messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesRepository)
    private readonly messagesRepository: MessagesRepository
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const newMessage = this.messagesRepository.create(dto);
    return this.messagesRepository.save(newMessage);
  }

  async getMessagesByConversation(conversation_id: string): Promise<Message[]> {
    return this.messagesRepository.find({ where: { conversation: { conversationId: conversation_id } } });
  }

  async getMessageById(message_id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne(message_id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${message_id} not found`);
    }
    return message;
  }

  async updateMessage(message_id: string, dto: UpdateMessageDto): Promise<Message> {
    await this.messagesRepository.update(message_id, dto);
    return this.getMessageById(message_id);
  }

  async deleteMessage(message_id: string): Promise<void> {
    await this.messagesRepository.delete(message_id);
  }
}
*/