import { getRepository } from 'typeorm';
import { User } from '@/entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';

class UsersService {
  async findAll(): Promise<User[]> {
    const userRepository = getRepository(User);
    return await userRepository.find();
  }

  async findById(userId: string): Promise<User | null> {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { user_id: userId } });
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { wallet_address: walletAddress } });
  }

  async findByUsername(username: string): Promise<User | null> {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userRepository = getRepository(User);
    
    // Check for existing user with same wallet address
    const existingWallet = await this.findByWalletAddress(createUserDto.walletAddress);
    if (existingWallet) {
      throw new Error(`User with wallet address ${createUserDto.walletAddress} already exists`);
    }

    // Check for existing username
    if (createUserDto.username) {
      const existingUsername = await this.findByUsername(createUserDto.username);
      if (existingUsername) {
        throw new Error(`Username ${createUserDto.username} is already taken`);
      }
    }

    // Check for existing email
    if (createUserDto.email) {
      const existingEmail = await this.findByEmail(createUserDto.email);
      if (existingEmail) {
        throw new Error(`Email ${createUserDto.email} is already registered`);
      }
    }

    // Map DTO to entity
    const newUser = userRepository.create({
      wallet_address: createUserDto.walletAddress,
      email: createUserDto.email,
      username: createUserDto.username
    });

    return await userRepository.save(newUser);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const userRepository = getRepository(User);
    const user = await this.findById(userId);
    
    if (!user) {
      return null;
    }

    // Check username uniqueness if being updated
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.findByUsername(updateUserDto.username);
      if (existingUsername) {
        throw new Error(`Username ${updateUserDto.username} is already taken`);
      }
    }

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.findByEmail(updateUserDto.email);
      if (existingEmail) {
        throw new Error(`Email ${updateUserDto.email} is already registered`);
      }
    }

    // Map DTO to entity properties
    if (updateUserDto.username !== undefined) user.username = updateUserDto.username;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.isActive !== undefined) user.is_active = updateUserDto.isActive;
    if (updateUserDto.twoFactorEnabled !== undefined) user.two_factor_enabled = updateUserDto.twoFactorEnabled;

    return await userRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await this.findById(userId);
    
    if (!user) {
      return false;
    }
    
    user.last_login = new Date();
    await userRepository.save(user);
    return true;
  }

  async remove(userId: string): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await this.findById(userId);
    
    if (!user) {
      return false;
    }
    
    await userRepository.remove(user);
    return true;
  }
}

const usersService = new UsersService();
export default usersService;