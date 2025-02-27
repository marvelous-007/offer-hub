import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { FreelancerSkill } from "./freelancer-skills.entity";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  skill_id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column("uuid")
  category_id!: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => FreelancerSkill, (freelancerSkill) => freelancerSkill.skill)
  freelancerSkills: FreelancerSkill[];
}
