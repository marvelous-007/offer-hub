import { Router, Request, Response } from "express";
import conversationsService from "../services/conversations.service";
import { CreateConversationDto, UpdateConversationDto } from "../dtos/conversations.dto";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const conversations = await conversationsService.getAll();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data: CreateConversationDto = req.body;
    const conversation = await conversationsService.create(data);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const conversation = await conversationsService.getById(req.params.id);
    if (conversation) {
      res.json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversation", error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data: UpdateConversationDto = req.body;
    const updated = await conversationsService.update(req.params.id, data);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating conversation", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await conversationsService.remove(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting conversation", error });
  }
});

export default router;
