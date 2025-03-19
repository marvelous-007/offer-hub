import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SkillsController } from "./controller";
import { SkillService } from "./service";
import { Skill } from "./entity";
import { Category } from "../categories/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Category])],
  controllers: [SkillsController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillsModule {}
