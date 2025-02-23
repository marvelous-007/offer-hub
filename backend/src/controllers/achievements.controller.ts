import { Request, Response, Router } from 'express';
import { AchievementsService } from '@/services/achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from '@/dtos/achievements.dto';

const router: Router = Router();
const achievementsService = new AchievementsService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateAchievementDto = req.body;
    const achievement = await achievementsService.createAchievement(dto);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const achievements = await achievementsService.getAchievements();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const achievement = await achievementsService.getAchievementById(req.params.id);
    if (achievement) {
      res.status(200).json(achievement);
    } else {
      res.status(404).json({ error: 'Achievement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievement' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const dto: UpdateAchievementDto = req.body;
    const achievement = await achievementsService.updateAchievement(req.params.id, dto);
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await achievementsService.deleteAchievement(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

export default router;
