import { getRepository, Repository } from 'typeorm';
import { Achievement } from '@/entities/achievements.entity';

export class AchievementsRepository {
  private repo: Repository<Achievement>;

  constructor() {
    this.repo = getRepository(Achievement);
  }

  async create(achievementData: Partial<Achievement>): Promise<Achievement> {
    const achievement = this.repo.create(achievementData);
    return await this.repo.save(achievement);
  }

  async findAll(): Promise<Achievement[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<Achievement | undefined> {
    return await this.repo.findOne({ where: { achievement_id: id } });
  }

  async update(id: string, achievementData: Partial<Achievement>): Promise<Achievement> {
    await this.repo.update(id, achievementData);
    return (await this.repo.findOne({ where: { achievement_id: id } }))!;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
