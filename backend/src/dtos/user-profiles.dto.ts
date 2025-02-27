
import { FreelancerSkill } from '@/entities/freelancer-skills.entity';
import { UserProfile } from '@/entities/user-profiles.entity';
import { IsString, IsOptional, IsUUID, IsArray, IsIn } from 'class-validator';

export class CreateUserProfileDTO {
    @IsUUID()
    user_id: string;

    @IsString()
    @IsIn(['freelancer', 'client'])
    profile_type: 'freelancer' | 'client';

    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    languages?: string[];

    @IsOptional()
    @IsString()
    profile_image_url?: string;
}

export class UpdateUserProfileDTO {
    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    languages?: string[];

    @IsOptional()
    @IsString()
    profile_image_url?: string;
}

export class UserProfileResponseDTO {
    profile_id: string;
    user_id: string;
    profile_type: 'freelancer' | 'client';
    full_name?: string;
    bio?: string;
    country?: string;
    timezone?: string;
    languages?: string[];
    profile_image_url?: string;
    updated_at: Date;
    freelancerSkills: FreelancerSkill[];

    constructor(data: UserProfile) {
        this.profile_id = data.profile_id;
        this.user_id = data.user_id;
        this.profile_type = data.profile_type;
        this.full_name = data.full_name;
        this.bio = data.bio;
        this.country = data.country;
        this.timezone = data.timezone;
        this.languages = data.languages;
        this.profile_image_url = data.profile_image_url;
        this.updated_at = data.updated_at;
    }
}
