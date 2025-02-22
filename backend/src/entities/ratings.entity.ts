import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  rating_id!: string;

  @Column('uuid')
  from_user_id!: string;

  @Column('uuid')
  to_user_id!: string;

  @Column('uuid')
  project_id!: string;

  @Column('integer')
  score!: number;

  @Column('text', { nullable: true })
  comment!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  fromUser!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  toUser!: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project!: Project;
} 