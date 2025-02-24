import { Router, Request, Response } from "express";
import notificationsService from "../services/notifications.service";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../dtos/notifications.dto";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(notificationsService.getAll());
});

router.post("/", (req: Request, res: Response) => {
  const data: CreateNotificationDto = req.body;
  const notification = notificationsService.create(data);
  res.status(201).json(notification);
});

router.get("/:id", (req: Request, res: Response) => {
  const notification = notificationsService.getById(req.params.id);
  if (notification) res.json(notification);
  else res.status(404).json({ message: "Notification not found" });
});

router.put("/:id", (req: Request, res: Response) => {
  const data: UpdateNotificationDto = req.body;
  const updated = notificationsService.update(req.params.id, data);
  if (updated) res.json(updated);
  else res.status(404).json({ message: "Notification not found" });
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = notificationsService.delete(req.params.id);
  if (deleted) res.status(204).send();
  else res.status(404).json({ message: "Notification not found" });
});

export default router;
