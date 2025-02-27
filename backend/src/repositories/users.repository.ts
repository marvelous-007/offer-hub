import { getRepository, Repository } from 'typeorm';
import { User } from '@/entities/users.entity';

export default class UsersRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = getRepository(User);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repo.findOne({ where: { user_id: id } });
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return await this.repo.findOne({ where: { wallet_address: walletAddress } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repo.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repo.update(id, userData);
    const updated = await this.repo.findOne({ where: { user_id: id } });
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repo.update(id, { last_login: new Date() });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}