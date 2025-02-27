export class CreateUserDto {
    walletAddress: string;
    email?: string;
    username: string;
  }
  
  export class UpdateUserDto {
    email?: string;
    username?: string;
    isActive?: boolean;
    twoFactorEnabled?: boolean;
  }
  
  export class UserResponseDto {
    userId: string;
    walletAddress: string;
    email?: string;
    username: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
    twoFactorEnabled: boolean;
  }