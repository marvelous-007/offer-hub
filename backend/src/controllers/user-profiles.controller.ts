import { Controller, Post, Get, Patch, Delete, Body, Param, NotFoundException, } from '@nestjs/common';
import { UserProfileService } from '@/services/user-profiles.service';
import { CreateUserProfileDTO, UpdateUserProfileDTO } from '@/dtos/user-profiles.dto';
import { UserProfile } from '@/entities/user-profiles.entity';
import { isUUID } from 'class-validator';

@Controller('user-profiles')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) { }

    @Post()
    createProfile(@Body() data: CreateUserProfileDTO): Promise<UserProfile> {
        return this.userProfileService.createProfile(data);
    }

    @Get(':id')
    async getProfile(@Param('id') profile_id: string): Promise<UserProfile | null> {
        if (!isUUID(profile_id)) {
            throw new NotFoundException('Invalid profile ID');
        }

        const profile = await this.userProfileService.getProfileById(profile_id);

        if (!profile) {
            throw new NotFoundException(`Profile with ID ${profile_id} not found`);
        }
        return profile;
    }

    @Patch(':id')
    updateProfile(@Param('id') profile_id: string, @Body() data: UpdateUserProfileDTO): Promise<UserProfile> {
        return this.userProfileService.updateProfile(profile_id, data);
    }

    @Delete(':id')
    deleteProfile(@Param('id') profile_id: string): Promise<void> {
        return this.userProfileService.deleteProfile(profile_id);
    }
}
