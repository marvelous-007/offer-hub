import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { user_id: id } });
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return await this.repository.findOne({ where: { wallet_address: walletAddress } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    const updated = await this.repository.findOne({ where: { user_id: id } });
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, { last_login: new Date() });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}