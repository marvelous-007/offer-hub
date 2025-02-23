import { Router, type Router as ExpressRouter } from "express";
import portfolioItemsController from "./controllers/portfolio-items.controller";
import achievementsController from "@/controllers/achievements.controller";
import notificationsController from "./controllers/notifications.controller";
import authLogsController from "./controllers/auth-logs.controller";
import userAchievementsRouter from "./controllers/achievements.controller"; // Usa la nueva ruta

const router: ExpressRouter = Router();

router.use("/portfolio-items", portfolioItemsController);
router.use("/achievements", achievementsController);
router.use("/notifications", notificationsController);
router.use("/auth-logs", authLogsController);
router.use("/user-achievements", userAchievementsRouter); // Ahora es un router de Express válido

export default router;
