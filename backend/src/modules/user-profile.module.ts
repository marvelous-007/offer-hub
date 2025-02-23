import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '@/entities/user-profiles.entity';
import { UserProfileRepository } from '@/repositories/user-profiles.repository';
import { UserProfileService } from '@/services/user-profiles.service';
import { UserProfileController } from '@/controllers/user-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  providers: [UserProfileRepository, UserProfileService],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
