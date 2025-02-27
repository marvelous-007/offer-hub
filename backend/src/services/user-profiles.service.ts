import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '@/repositories/user-profiles.repository';
import { CreateUserProfileDTO, UpdateUserProfileDTO, UserProfileResponseDTO } from '@/dtos/user-profiles.dto';
import { UserProfile } from '@/entities/user-profiles.entity';

@Injectable()
export class UserProfileService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async createProfile(data: CreateUserProfileDTO): Promise<UserProfileResponseDTO> {
    const profile : UserProfile = await this.userProfileRepository.createProfile(data);
    return new UserProfileResponseDTO(profile);
  }

  async getProfileById(profile_id: string): Promise<UserProfileResponseDTO | null> {
    const profile : UserProfile | null = await this.userProfileRepository.findProfileById(profile_id);
    return profile ? new UserProfileResponseDTO(profile) : null;
  }

  async updateProfile(profile_id: string, data: UpdateUserProfileDTO): Promise<UserProfileResponseDTO> {
    const profile = await this.userProfileRepository.updateProfile(profile_id, data);
    return new UserProfileResponseDTO(profile);
  }

  async deleteProfile(profile_id: string): Promise<void> {
    return this.userProfileRepository.deleteProfile(profile_id);
  }
}
