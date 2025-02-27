import { Router, Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { CreateUserDto, UpdateUserDto } from "../dtos/users.dto";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UsersService.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data: CreateUserDto = req.body;
    const user = await UsersService.create(data);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get("/wallet/:address", async (req: Request, res: Response) => {
  try {
    const user = await UsersService.findByWalletAddress(req.params.address);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await UsersService.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data: UpdateUserDto = req.body;
    const updated = await UsersService.update(req.params.id, data);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await UsersService.remove(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;