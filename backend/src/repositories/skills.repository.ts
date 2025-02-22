import { getRepository, Repository } from "typeorm";
import { Skill } from "../entities/skills.entity";

export class SkillsRepository {
  private repo: Repository<Skill>;

  constructor() {
    this.repo = getRepository(Skill);
  }

  async create(skillData: Partial<Skill>): Promise<Skill> {
    const skill = this.repo.create(skillData);
    return await this.repo.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.repo.find({
      relations: ["toCategory"],
    });
  }

  async findById(id: string): Promise<Skill | null> {
    return await this.repo.findOne({
      where: { skill_id: id },
      relations: ["toCategory"],
    });
  }

  async update(id: string, skillData: Partial<Skill>): Promise<Skill> {
    await this.repo.update(id, skillData);
    return (await this.repo.findOne({ where: { skill_id: id } }))!;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
