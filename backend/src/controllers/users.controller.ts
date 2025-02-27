import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/services/users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/dtos/users.dto';
import { User } from '@/entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(this.mapToResponseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return this.mapToResponseDto(user);
  }

  @Get('wallet/:address')
  async findByWalletAddress(@Param('address') address: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByWalletAddress(address);
    return this.mapToResponseDto(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return this.mapToResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      walletAddress: user.walletAddress,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }
}