import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerSkill } from '@/entities/freelancer-skills.entity';
import { FreelancerSkillsService } from '@/services/freelancer-skills.service';
import { FreelancerSkillsController } from '@/controllers/freelancer-skills.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerSkill])],
  controllers: [FreelancerSkillsController],
  providers: [FreelancerSkillsService],
})
export class FreelancerSkillsModule {}
