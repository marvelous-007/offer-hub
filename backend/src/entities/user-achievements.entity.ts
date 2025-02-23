import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
// import { User } from "@/entities/user.entity";
import { Achievement } from "@/entities/achievements.entity";

@Entity("user_achievements")
export class UserAchievement {
    @PrimaryColumn("uuid")
    user_id: string;

    @PrimaryColumn("uuid")
    achievement_id: string;

   // @ManyToOne(() => User, (user) => user.user_achievements, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
   //  user: User;

   // @ManyToOne(() => Achievement, (achievement) => achievement.user_achievements, { onDelete: "CASCADE" })
    @JoinColumn({ name: "achievement_id" })
    achievement: Achievement;

    @Column({ type: "varchar", length: 100, nullable: true })
    nft_token_id?: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    achieved_at: Date;
}
