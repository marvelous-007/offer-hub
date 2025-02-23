import { Controller, Get, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { UserAchievementsService } from "@/services/user-achievements.service";
import { CreateUserAchievementDTO } from "@/dtos/user-achievements.dto";
import { UserAchievement } from "@/entities/user-achievements.entity";

@Controller("user-achievements")
export class UserAchievementsController {
    constructor(private readonly userAchievementsService: UserAchievementsService) {}

    @Post()
    async create(@Body() dto: CreateUserAchievementDTO): Promise<UserAchievement> {
        try {
            return await this.userAchievementsService.create(dto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll(): Promise<UserAchievement[]> {
        try {
            return await this.userAchievementsService.findAll();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
