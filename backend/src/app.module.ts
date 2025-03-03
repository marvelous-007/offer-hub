import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

config(); // Cargar variables de entorno

//=======================================
//               Entities
//=======================================
import { ActivityLogs } from './modules-v2/activity-logs/entity';
import { AuthLog } from './modules-v2/auth-logs/entity';
import { Category } from './modules-v2/categories/entity';
import { Certification } from './modules-v2/certifications/entity';
import { Conversation } from './modules-v2/conversations/entity';
import { FreelancerSkill } from './modules-v2/freelancer-skills/entity';
import { Message } from './modules-v2/messages/entity';
import { Notification } from './modules-v2/notifications/entity';
import { PortfolioItem } from './modules-v2/portfolio-items/entity';
import { Project } from './modules-v2/projects/entity';
import { Rating } from './modules-v2/ratings/entity';
import { Skill } from './modules-v2/skills/entity';
import { Transaction } from './modules-v2/transactions/entity';
import { User } from './modules-v2/users/entity';
import { UserAchievement } from './modules-v2/user-achievements/entity';
import { UserProfile } from './modules-v2/user-profiles/entity';
import { Achievement } from './modules-v2/achievements/entity';
import { ServicesModule } from '@/modules-v2/services/module';

//=======================================
//               Modules
//=======================================
import { ActivityLogsModule } from './modules-v2/activity-logs/module';
import { AuthLogsModule } from './modules-v2/auth-logs/module';
import { CategoriesModule } from './modules-v2/categories/module';
import { CertificationsModule } from './modules-v2/certifications/module';
import { ConversationsModule } from './modules-v2/conversations/module';
import { FreelancerSkillsModule } from './modules-v2/freelancer-skills/module';
import { MessagesModule } from './modules-v2/messages/module';
import { NotificationsModule } from './modules-v2/notifications/module';
import { PortfolioItemsModule } from './modules-v2/portfolio-items/module';
import { ProjectsModule } from './modules-v2/projects/module';
import { RatingsModule } from './modules-v2/ratings/module';
import { SkillsModule } from './modules-v2/skills/module';
import { TransactionsModule } from './modules-v2/transactions/module';
import { UsersModule } from './modules-v2/users/module';
import { UserAchievementsModule } from './modules-v2/user-achievements/module';
import { UserProfileModule } from './modules-v2/user-profiles/module';
import { AchievementsModule } from './modules-v2/achievements/module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || (process.env.DOCKER_ENV ? 'offer_hub_database' : 'localhost'),
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'offerhub_admin',
      password: process.env.DATABASE_PASSWORD || 'offerhub_pass',
      database: process.env.DATABASE_NAME || 'offer_hub_database',
      entities: [
        Achievement, 
        ActivityLogs,
        AuthLog,
        Category,
        Certification,
        Conversation,
        FreelancerSkill,
        Message,
        Notification,
        PortfolioItem,
        Project,
        Rating,
        Skill,
        Transaction,
        User,
        UserAchievement,
        UserProfile,
        ServicesModule,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ActivityLogsModule,
    AuthLogsModule,
    CategoriesModule,
    CertificationsModule,
    ConversationsModule,
    FreelancerSkillsModule,
    MessagesModule,
    NotificationsModule,
    PortfolioItemsModule,
    ProjectsModule,
    RatingsModule,
    SkillsModule,
    TransactionsModule,
    UsersModule,
    UserAchievementsModule,
    UserProfileModule,
    AchievementsModule, 
  ],
})
export class AppModule {}
