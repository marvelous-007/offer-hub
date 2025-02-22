import { Router, Request, Response } from "express";
import portfolioItemsService from "../services/portfolio-items.service";
import {
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from "../dtos/portfolio-items.dto";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(portfolioItemsService.getAll());
});

router.post("/", (req: Request, res: Response) => {
  const data: CreatePortfolioItemDto = req.body;
  const portfolioItem = portfolioItemsService.create(data);
  res.status(201).json(portfolioItem);
});

router.get("/:id", (req: Request, res: Response) => {
  const portfolioItem = portfolioItemsService.getById(req.params.id);
  if (portfolioItem) res.json(portfolioItem);
  else res.status(404).json({ message: "Portfolio item not found" });
});

router.put("/:id", (req: Request, res: Response) => {
  const data: UpdatePortfolioItemDto = req.body;
  const updated = portfolioItemsService.update(req.params.id, data);
  if (updated) res.json(updated);
  else res.status(404).json({ message: "Portfolio item not found" });
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = portfolioItemsService.delete(req.params.id);
  if (deleted) res.status(204).json({ message: "Portfolio item deleted !" });
  else res.status(404).json({ message: "Portfolio item not found" });
});

export default router;
