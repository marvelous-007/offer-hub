import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service";
import { AppError } from "@/utils/AppError";

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallet_address, username, name, bio, email, is_freelancer } = req.body;

    if (!wallet_address || !username) {
      throw new AppError("Missing_required_fields", 400);
    }

    const user = await userService.createUser({
      wallet_address,
      username,
      name,
      bio,
      email,
      is_freelancer,
    });

    res.status(201).json({
      success: true,
      message: "User_created_successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};