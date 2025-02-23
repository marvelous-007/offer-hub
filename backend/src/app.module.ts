import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsModule } from './ratings.module';
import { Rating } from './entities/ratings.entity';
import { Category } from './entities/categories.entity';

// Commented out since the files do not exist
// import { User } from './entities/user.entity';
// import { Project } from './entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'offerhub',
      entities: [Rating, Category],
      synchronize: true,
    }),
    RatingsModule,
  ],
})
export class AppModule {}
