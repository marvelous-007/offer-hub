import { Entity, Column, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skills.entity';
import { UserProfile } from './user-profiles.entity';

@Entity("freelancer_skills")
export class FreelancerSkill {  
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  skill_id: string;

  @ManyToOne(() => UserProfile, (user) => user.freelancerSkills, { onDelete: 'CASCADE' })
  user: UserProfile;

  @ManyToOne(() => Skill, (skill) => skill.freelancerSkills, { onDelete: 'CASCADE' })
  skill: Skill;

  @Column({ type: 'varchar', length: 20 })
  experience_level: 'beginner' | 'intermediate' | 'expert';
}