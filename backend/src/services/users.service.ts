import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { wallet_address: walletAddress } });
    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing user with same wallet address
    const existingWallet = await this.usersRepository.findOne({ 
      where: { wallet_address: createUserDto.walletAddress } 
    });
    
    if (existingWallet) {
      throw new ConflictException(`User with wallet address ${createUserDto.walletAddress} already exists`);
    }

    // Check for existing username
    if (createUserDto.username) {
      const existingUsername = await this.findByUsername(createUserDto.username);
      if (existingUsername) {
        throw new ConflictException(`Username ${createUserDto.username} is already taken`);
      }
    }

    // Check for existing email
    if (createUserDto.email) {
      const existingEmail = await this.findByEmail(createUserDto.email);
      if (existingEmail) {
        throw new ConflictException(`Email ${createUserDto.email} is already registered`);
      }
    }

    // Map DTO to entity
    const newUser = this.usersRepository.create({
      wallet_address: createUserDto.walletAddress,
      email: createUserDto.email,
      username: createUserDto.username
    });

    return await this.usersRepository.save(newUser);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check username uniqueness if being updated
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.findByUsername(updateUserDto.username);
      if (existingUsername) {
        throw new ConflictException(`Username ${updateUserDto.username} is already taken`);
      }
    }

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.findByEmail(updateUserDto.email);
      if (existingEmail) {
        throw new ConflictException(`Email ${updateUserDto.email} is already registered`);
      }
    }

    // Map DTO to entity properties
    if (updateUserDto.username !== undefined) user.username = updateUserDto.username;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.isActive !== undefined) user.is_active = updateUserDto.isActive;
    if (updateUserDto.twoFactorEnabled !== undefined) user.two_factor_enabled = updateUserDto.twoFactorEnabled;

    return await this.usersRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    user.last_login = new Date();
    return await this.usersRepository.save(user);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { user_id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    await this.usersRepository.remove(user);
  }
}