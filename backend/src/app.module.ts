import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsModule } from './ratings.module';
import { Rating } from './entities/ratings.entity';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'offerhub',
      entities: [Rating, User, Project],
      synchronize: true,
    }),
    RatingsModule
  ],
})
export class AppModule {} 