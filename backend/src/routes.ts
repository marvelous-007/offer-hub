import { Router } from "express";
import notificationsController from "./controllers/notifications.controller";
import authLogsController from "./controllers/auth-logs.controller";

const router = Router();

router.use("/notifications", notificationsController);
router.use("/auth-logs", authLogsController);

export default router;