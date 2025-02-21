import { Router } from "express";
import notificationsController from "./controllers/notifications.controller";
import { activityLogsRouter } from "@/controllers";

const router = Router();
router.use("/notifications", notificationsController);
router.use("/activity-logs", activityLogsRouter);

export default router;
