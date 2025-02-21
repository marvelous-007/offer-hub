import { Router } from "express";
import portfolioItemsController from "./controllers/portfolio-items.controller";

const router = Router();
router.use("/portfolio-items", portfolioItemsController);

export default router;
