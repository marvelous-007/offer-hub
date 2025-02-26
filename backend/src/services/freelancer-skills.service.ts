import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FreelancerSkill } from "@/entities/freelancer-skills.entity";
import { CreateFreelancerSkillDto, UpdateFreelancerSkillDto } from "@/dtos/freelancer-skills.dto";
import { validate } from "class-validator";

@Injectable()
export class FreelancerSkillsService {
  constructor(
    @InjectRepository(FreelancerSkill)
    private readonly repo: Repository<FreelancerSkill>
  ) {}

  async create(dto: CreateFreelancerSkillDto) {
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const skill = this.repo.create(dto);
    return this.repo.save(skill);
  }

  async getAll() {
    return this.repo.find();
  }

  async getById(user_id: string, skill_id: string) {
    const skill = await this.repo.findOne({ where: { user_id, skill_id } });
    if (!skill) {
      throw new NotFoundException(`Freelancer skill with user_id ${user_id} and skill_id ${skill_id} not found.`);
    }
    return skill;
  }

  async update(user_id: string, skill_id: string, dto: UpdateFreelancerSkillDto) {
    const skill = await this.getById(user_id, skill_id);
    Object.assign(skill, dto);
    return this.repo.save(skill);
  }

  async delete(user_id: string, skill_id: string) {
    const result = await this.repo.delete({ user_id, skill_id });
    if (result.affected === 0) {
      throw new NotFoundException(`Freelancer skill with user_id ${user_id} and skill_id ${skill_id} not found.`);
    }
    return result;
  }
}
