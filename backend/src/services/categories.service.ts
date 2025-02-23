import CategoriesRepository from '@/repositories/categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';
import { Category } from '@/entities/categories.entity';

export default class CategoriesService {
  private categoriesRepository: CategoriesRepository;

  constructor() {
    this.categoriesRepository = new CategoriesRepository();
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesRepository.create(dto);
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoriesRepository.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.categoriesRepository.findBySlug(slug);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    return await this.categoriesRepository.update(id, dto);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}