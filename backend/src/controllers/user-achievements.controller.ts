import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { UserAchievementsService } from '../services/user-achievements.service';
import { CreateUserAchievementDTO } from '../dtos/user-achievements.dto';
import type { UserAchievementResponseDTO } from '../dtos/user-achievements.dto';

@Controller('user-achievements')
export class UserAchievementsController {
  constructor(private readonly userAchievementsService: UserAchievementsService) {}

  @Post()
  async create(@Body() createUserAchievementDto: CreateUserAchievementDTO): Promise<UserAchievementResponseDTO> {
    try {
      return await this.userAchievementsService.create(createUserAchievementDto);
    } catch (error) {
      throw new HttpException('Failed to create user achievement', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<UserAchievementResponseDTO[]> {
    try {
      return await this.userAchievementsService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch user achievements', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<UserAchievementResponseDTO> {
    try {
      return await this.userAchievementsService.findOne(userId);
    } catch (error) {
      throw new HttpException('Failed to fetch user achievements', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':userId/:achievementId')
  deleteUserAchievement(
    @Param('userId') user_id: string,
    @Param('achievementId') achievement_id: string
  ): Promise<void> {
    return this.userAchievementsService.deleteUserAchievement(user_id, achievement_id);
  }
}
