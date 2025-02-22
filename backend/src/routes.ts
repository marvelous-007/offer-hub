import { Router } from 'express';
import achievementsController from '@/controllers/achievements.controller';
import notificationsController from "./controllers/notifications.controller";
import authLogsController from "./controllers/auth-logs.controller";
import SkillsController from './controllers/skills.controller';

const router = Router();

router.use('/achievements', achievementsController);
router.use("/notifications", notificationsController);
router.use("/auth-logs", authLogsController);
router.use('/skills', SkillsController);

export default router;
