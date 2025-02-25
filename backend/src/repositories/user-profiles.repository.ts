import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@/entities/user-profiles.entity';

@Injectable()
export class UserProfileRepository {
    constructor(
        @InjectRepository(UserProfile)
        private readonly repo: Repository<UserProfile>,
    ) { }

    async createProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        const profile = this.repo.create(data);
        return this.repo.save(profile);
    }

    async findProfileById(profile_id: string): Promise<UserProfile | null> {
        return this.repo.findOne({ where: { profile_id } });
    }

    async updateProfile(profile_id: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const profile = await this.findProfileById(profile_id);
        if (!profile) {
            throw new NotFoundException(`Profile with ID ${profile_id} not found`);
        }
        await this.repo.update(profile_id, data);
        return this.findProfileById(profile_id) as Promise<UserProfile>;
    }

    async deleteProfile(profile_id: string): Promise<void> {
        await this.repo.delete(profile_id);
    }
}
