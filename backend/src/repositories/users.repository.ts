import { EntityRepository, Repository } from 'typeorm';
import { User } from '@/entities/users.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.findOne({ where: { walletAddress } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLogin: new Date() });
  }
}