import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Conversation } from '@/entities/conversations.entity';
import { User } from '@/entities/users.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.conversationId, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  sender: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  read_at: Date;
}
