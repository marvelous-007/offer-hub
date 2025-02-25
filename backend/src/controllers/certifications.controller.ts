import { Router, Request, Response } from "express";
import certificationsService from "../services/certifications.service";
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from "../dtos/certifications.dto";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(certificationsService.getAll());
});

router.post("/", (req: Request, res: Response) => {
  const data: CreateCertificationDto = req.body;
  const certification = certificationsService.create(data);
  res.status(201).json(certification);
});

router.get("/:id", (req: Request, res: Response) => {
  const certification = certificationsService.getById(req.params.id);
  if (certification) res.json(certification);
  else res.status(404).json({ message: "Certification not found" });
});

router.put("/:id", (req: Request, res: Response) => {
  const data: UpdateCertificationDto = req.body;
  const updated = certificationsService.update(req.params.id, data);
  if (updated) res.json(updated);
  else res.status(404).json({ message: "Certification not found" });
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = certificationsService.delete(req.params.id);
  if (deleted) res.status(204).send();
  else res.status(404).json({ message: "Certification not found" });
});

export default router;