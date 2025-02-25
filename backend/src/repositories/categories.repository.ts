// categories.repository.ts
import { getRepository, Repository } from 'typeorm';
import { Category } from '@/entities/categories.entity';

// Add 'export default' to fix the import issue
export default class CategoriesRepository {
  private repo: Repository<Category>;

  constructor() {
    this.repo = getRepository(Category);
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.repo.create(categoryData);
    return await this.repo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<Category | null> {
    return await this.repo.findOne({ where: { category_id: id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.repo.findOne({ where: { slug } });
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    await this.repo.update(id, categoryData);
    const updated = await this.repo.findOne({ where: { category_id: id } });
    if (!updated) {
      throw new Error('Category not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
