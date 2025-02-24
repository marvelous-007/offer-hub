import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
// import { Category } from "./category.entity";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  skill_id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column("text", { nullable: true })
  comment!: string;

  @Column("uuid")
  category_id!: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  // @OneToOne(() => Category)
  // @JoinColumn({ name: "category_id" })
  // toCategory!: Category;
}
