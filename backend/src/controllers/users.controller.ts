import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '@/services/users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/dtos/users.dto';
import { User } from '@/entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User>{
    return await this.usersService.findById(id);
  }

  @Get('wallet/:address')
  async findByWalletAddress(@Param('address') address: string): Promise<User> {
    return await this.usersService.findByWalletAddress(address);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }
}