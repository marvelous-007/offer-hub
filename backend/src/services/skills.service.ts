import { SkillsRepository } from "../repositories/skills.repository";
import { CreateSkillDto, UpdateSkillDto } from "../dtos/skills.dto";
import { Skill } from "../entities/skills.entity";

export class SkillsService {
  private skillsRepository: SkillsRepository;

  constructor() {
    this.skillsRepository = new SkillsRepository();
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    return await this.skillsRepository.create(dto);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillsRepository.findAll();
  }

  async findById(id: string): Promise<Skill | null> {
    return await this.skillsRepository.findById(id);
  }

  async update(id: string, dto: UpdateSkillDto): Promise<Skill> {
    return await this.skillsRepository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    await this.skillsRepository.delete(id);
  }
}
