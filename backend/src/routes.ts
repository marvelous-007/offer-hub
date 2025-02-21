import { Router } from "express";
import notificationsController from "./controllers/notifications.controller";
import authLogsController from "./controllers/auth-logs.controller";
import { activityLogsRouter } from "@/controllers";

const router = Router();
router.use("/notifications", notificationsController);
router.use("/auth-logs", authLogsController);
router.use("/activity-logs", activityLogsRouter);

export default router;
