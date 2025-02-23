import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { UserProfileService } from '@/services/user-profiles.service';
import { CreateUserProfileDTO, UpdateUserProfileDTO } from '@/dtos/user-profiles.dto';
import { UserProfile } from '@/entities/user-profiles.entity';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  createProfile(@Body() data: CreateUserProfileDTO): Promise<UserProfile> {
    return this.userProfileService.createProfile(data);
  }

  @Get(':id')
  getProfile(@Param('id') profile_id: string): Promise<UserProfile | null> {
    return this.userProfileService.getProfileById(profile_id);
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
