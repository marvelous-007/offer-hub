import { getRepository } from "typeorm";
import { Conversation } from "../entities/conversations.entity";
import { CreateConversationDto, UpdateConversationDto } from "../dtos/conversations.dto";

const conversationRepository = getRepository(Conversation);

const getAll = async (): Promise<Conversation[]> => {
  return await conversationRepository.find();
};

const create = async (data: CreateConversationDto): Promise<Conversation> => {
  const newConversation = conversationRepository.create({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return await conversationRepository.save(newConversation);
};

const getById = async (id: string): Promise<Conversation | null> => {
    return await conversationRepository.findOne({
      where: { conversationId: id },
    });
};  
  
const update = async (
  id: string,
  data: UpdateConversationDto
): Promise<Conversation | null> => {
  const conversation = await getById(id);
  if (!conversation) return null;

  conversation.updatedAt = new Date();

  return await conversationRepository.save(conversation);
};

const removeConversation = async (id: string): Promise<boolean> => {
  const conversation = await getById(id);
  if (!conversation) return false;

  await conversationRepository.remove(conversation);
  return true;
};

export default { getAll, create, getById, update, remove: removeConversation };
