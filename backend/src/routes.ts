import { Router } from "express";
import portfolioItemsController from "./controllers/portfolio-items.controller";
import notificationsController from "./controllers/notifications.controller";

const router = Router();
router.use("/portfolio-items", portfolioItemsController);
router.use("/notifications", notificationsController);


export default router;
