import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'offerhub',
      entities: [
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
  ],
})
export class AppModule {}
