import { Injectable, NotFoundException } from "@nestjs/common";
import { UserAchievementsRepository } from "@/repositories/user-achievements.repository";
import { CreateUserAchievementDTO } from "@/dtos/user-achievements.dto";
import { UserAchievement } from "@/entities/user-achievements.entity";
import type { UserAchievementResponseDTO } from "@/dtos/user-achievements.dto";

@Injectable()
export class UserAchievementsService {
    constructor(
        private readonly userAchievementsRepository: UserAchievementsRepository
    ) {}

    async create(dto: CreateUserAchievementDTO): Promise<UserAchievement> {
        return await this.userAchievementsRepository.create(dto);
    }

    async findOne(userId: string): Promise<UserAchievementResponseDTO> {
        const userAchievements = await this.userAchievementsRepository.findOne(userId);
        
        if (!userAchievements || userAchievements.length === 0) {
            throw new NotFoundException('User achievements not found');
        }
    
        const userAchievement = userAchievements[0]; 
    
        return {
            user_id: userAchievement.user_id,
            achievement_id: userAchievement.achievement_id,
        };
    }
    
    async findAll(): Promise<UserAchievement[]> {
        return await this.userAchievementsRepository.findAll();
    }

    async deleteUserAchievement(user_id: string,achievement_id: string): Promise<void> {
        return this.userAchievementsRepository.delete(user_id, achievement_id);
      }
}