import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAchievementsController } from "@/controllers/user-achievements.controller";
import { UserAchievementsService } from "@/services/user-achievements.service";
import { UserAchievement } from "@/entities/user-achievements.entity"; 

@Module({
    imports: [TypeOrmModule.forFeature([UserAchievement])], 
    controllers: [UserAchievementsController], 
    providers: [UserAchievementsService], 
    exports: [UserAchievementsService],
})
export class UserAchievementsModule {}
