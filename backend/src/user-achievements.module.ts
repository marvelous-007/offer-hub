import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from '@/entities/user-achievements.entity';
import { UserAchievementsRepository } from '@/repositories/user-achievements.repository';
import { UserAchievementsService } from '@/services/user-achievements.service';
import { UserAchievementsController } from '@/controllers/user-achievements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement])],
  providers: [UserAchievementsRepository, UserAchievementsService],
  controllers: [UserAchievementsController],
  exports: [UserAchievementsService],
})
export class UserAchievementsModule {}