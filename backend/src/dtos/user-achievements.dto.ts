
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAchievement } from '@/entities/user-achievements.entity';
import { IsString, IsOptional, IsUUID, IsArray, IsIn } from 'class-validator';

export class CreateUserAchievementDTO {
    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'uuid' })
    achievement_id: string;

    @Column({ type: 'uuid' })
    nft_token_id?: string;
}

export class UserAchievementResponseDTO {
    user_id: string;
    achievement_id: string;
    nft_token_id?: string;

    constructor(data: UserAchievement) {
        this.user_id = data.user_id;
        this.achievement_id = data.achievement_id;
        this.nft_token_id = data.nft_token_id;
    }
}