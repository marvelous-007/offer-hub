import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/entity";
import { Achievement } from "../achievements/entity";

@Entity("user_achievements")
export class UserAchievement {
  @PrimaryColumn("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  achievement_id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Achievement, { onDelete: "CASCADE" })
  @JoinColumn({ name: "achievement_id" })
  achievement: Achievement;

  @Column({ type: "varchar", length: 100, nullable: true })
  nft_token_id?: string;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  achieved_at: Date;
}
