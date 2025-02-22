import { Router, Request, Response } from "express";
import authLogsService from "../services/auth-logs.service";
import {
  CreateAuthLogDto,
  UpdateAuthLogDto,
} from "../dtos/auth-logs.dto";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(authLogsService.getAll());
});

router.post("/", (req: Request, res: Response) => {
  const data: CreateAuthLogDto = req.body;
  const authLog = authLogsService.create(data);
  res.status(201).json(authLog);
});

router.get("/:id", (req: Request, res: Response) => {
  const authLog = authLogsService.getById(req.params.id);
  if (authLog) res.json(authLog);
  else res.status(404).json({ message: "Auth log not found" });
});

router.put("/:id", (req: Request, res: Response) => {
  const data: UpdateAuthLogDto = req.body;
  const updated = authLogsService.update(req.params.id, data);
  if (updated) res.json(updated);
  else res.status(404).json({ message: "Auth log not found" });
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = authLogsService.delete(req.params.id);
  if (deleted) res.status(204).send();
  else res.status(404).json({ message: "Auth log not found" });
});

// Additional routes specific to auth logs
router.get("/user/:userId", (req: Request, res: Response) => {
  const logs = authLogsService.getByUserId(req.params.userId);
  res.json(logs);
});

router.get("/event-type/:type", (req: Request, res: Response) => {
  const logs = authLogsService.getByEventType(req.params.type);
  res.json(logs);
});

export default router;