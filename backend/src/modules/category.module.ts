import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../entities/ratings.entity';
import { Category } from '../entities/categories.entity';
import { CategoriesController } from "../controllers/categories.controller"
import { CategoriesService } from "../services/categories.service";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoryModule { } 