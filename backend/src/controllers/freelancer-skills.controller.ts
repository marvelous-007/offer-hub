import { FreelancerSkillsService } from '@/services/freelancer-skills.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateFreelancerSkillDto, UpdateFreelancerSkillDto } from '@/dtos/freelancer-skills.dto';

@Controller("freelancer-skills")
export class FreelancerSkillsController {
  constructor(private readonly service: FreelancerSkillsService) {}

  @Post()
  async create(@Body() dto: CreateFreelancerSkillDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.getAll();
  }

  @Get(':user_id/:skill_id')
  async findOne(@Param('user_id') user_id: string, @Param('skill_id') skill_id: string) {
    return await this.service.getById(user_id, skill_id);
  }

  @Put(':user_id/:skill_id')
  async update(
    @Param('user_id') user_id: string,
    @Param('skill_id') skill_id: string,
    @Body() dto: UpdateFreelancerSkillDto
  ) {
    return await this.service.update(user_id, skill_id, dto);
  }

  @Delete(':user_id/:skill_id')
  async delete(@Param('user_id') user_id: string, @Param('skill_id') skill_id: string) {
    return await this.service.delete(user_id, skill_id);
  }
}