import { EntityRepository, Repository } from "typeorm";
import { UserAchievement } from "@/entities/user-achievements.entity";

@EntityRepository(UserAchievement)
export class UserAchievementsRepository extends Repository<UserAchievement> {}
