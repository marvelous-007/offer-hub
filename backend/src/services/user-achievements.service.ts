import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAchievement } from "@/entities/user-achievements.entity";
import { CreateUserAchievementDTO } from "@/dtos/user-achievements.dto";
import { UserAchievementsRepository } from "@/repositories/user-achievements.repository";

@Injectable()
export class UserAchievementsService {
    constructor(
        @InjectRepository(UserAchievementsRepository)
        private readonly userAchievementsRepository: Repository<UserAchievement>, 
    ) {}

    async create(dto: CreateUserAchievementDTO): Promise<UserAchievement> {
        const userAchievement = this.userAchievementsRepository.create(dto);
        return await this.userAchievementsRepository.save(userAchievement);
    }

    async findAll(): Promise<UserAchievement[]> {
        return await this.userAchievementsRepository.find();
    }
}
