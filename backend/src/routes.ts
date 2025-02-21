import { Router } from 'express';
import achievementsController from '@/controllers/achievements.controller';

const router = Router();

router.use('/achievements', achievementsController);

export default router;
