import { Router } from 'express';
import achievementsController from '@/controllers/achievements.controller';
import notificationsController from "./controllers/notifications.controller";

const router = Router();

router.use('/achievements', achievementsController);
router.use("/notifications", notificationsController);

export default router;
