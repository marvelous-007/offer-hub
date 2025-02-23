import { Request, Response, Router } from 'express';
import CategoriesService from '@/services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';

const router: Router = Router();
const categoriesService = new CategoriesService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateCategoryDto = req.body;
    const category = await categoriesService.createCategory(dto);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await categoriesService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await categoriesService.getCategoryById(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const dto: UpdateCategoryDto = req.body;
    const category = await categoriesService.updateCategory(req.params.id, dto);
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof Error && error.message === 'Category not found after update') {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await categoriesService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;