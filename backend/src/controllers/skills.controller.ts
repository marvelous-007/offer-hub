import { Request, Response, Router } from "express";
import { SkillsService } from "../services/skills.service";
import { CreateSkillDto, UpdateSkillDto } from "../dtos/skills.dto";

const router: Router = Router();
const skillsService = new SkillsService();

router.post("/", async (req: Request, res: Response) => {
  try {
    const dto: CreateSkillDto = req.body;
    const skill = await skillsService.create(dto);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to create skill" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await skillsService.findAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const skill = await skillsService.findById(req.params.id);
    if (skill) {
      res.status(200).json(skill);
    } else {
      res.status(404).json({ error: "Skill not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skill" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const dto: UpdateSkillDto = req.body;
    const skill = await skillsService.update(req.params.id, dto);
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to update skill" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await skillsService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

export default router;
