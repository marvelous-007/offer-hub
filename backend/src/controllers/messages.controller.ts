import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { MessagesService } from '@/services/messages.service';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get('/conversation/:conversation_id')
  async getMessages(@Param('conversation_id') conversation_id: string) {
    return this.messagesService.getMessagesByConversation(conversation_id);
  }

  @Get('/:message_id')
  async getMessage(@Param('message_id') message_id: string) {
    return this.messagesService.getMessageById(message_id);
  }

  @Patch('/:message_id')
  async updateMessage(
    @Param('message_id') message_id: string,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.updateMessage(message_id, updateMessageDto);
  }

  @Delete('/:message_id')
  async deleteMessage(@Param('message_id') message_id: string) {
    return this.messagesService.deleteMessage(message_id);
  }
}
