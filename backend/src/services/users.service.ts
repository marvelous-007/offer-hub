import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '@/repositories/users.repository';
import { User } from '@/entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.usersRepository.findByWalletAddress(walletAddress);
    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing user with same wallet address
    const existingWallet = await this.usersRepository.findByWalletAddress(createUserDto.walletAddress);
    if (existingWallet) {
      throw new ConflictException(`User with wallet address ${createUserDto.walletAddress} already exists`);
    }

    // Check for existing username
    if (createUserDto.username) {
      const existingUsername = await this.usersRepository.findByUsername(createUserDto.username);
      if (existingUsername) {
        throw new ConflictException(`Username ${createUserDto.username} is already taken`);
      }
    }

    // Check for existing email
    if (createUserDto.email) {
      const existingEmail = await this.usersRepository.findByEmail(createUserDto.email);
      if (existingEmail) {
        throw new ConflictException(`Email ${createUserDto.email} is already registered`);
      }
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);

    // Check username uniqueness if being updated
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.usersRepository.findByUsername(updateUserDto.username);
      if (existingUsername) {
        throw new ConflictException(`Username ${updateUserDto.username} is already taken`);
      }
    }

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findByEmail(updateUserDto.email);
      if (existingEmail) {
        throw new ConflictException(`Email ${updateUserDto.email} is already registered`);
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.updateLastLogin(userId);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.usersRepository.remove(user);
  }
}