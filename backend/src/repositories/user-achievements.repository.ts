
import { UserAchievement } from "@/entities/user-achievements.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserAchievementsRepository {

    constructor(@InjectRepository(UserAchievement)
        private readonly repo: Repository<UserAchievement>,) {

    }

    async create(userAchievementData: Partial<UserAchievement>): Promise<UserAchievement> {
        const userAchievement = this.repo.create(userAchievementData);
        return await this.repo.save(userAchievement);
    }

    async findAll(): Promise<UserAchievement[]> {
        return await this.repo.find();
    }

    async findOne(userId: string): Promise<UserAchievement[]> {
        return await this.repo.find({ where: { user_id: userId.toString() }, relations: ["achievement"] });
    }

    async update(userId: string, achievementId: string, userAchievementData: Partial<UserAchievement>): Promise<UserAchievement> {
        await this.repo.update({ user_id: userId, achievement_id: achievementId }, userAchievementData);
        return (await this.repo.findOne({ where: { user_id: userId, achievement_id: achievementId } }))!;
    }

    async delete(userId: string, achievementId: string): Promise<void> {
        await this.repo.delete({ user_id: userId, achievement_id: achievementId });
    }
}
