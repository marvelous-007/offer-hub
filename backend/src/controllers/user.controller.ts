import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service";
import { AppError } from "@/utils/AppError";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User_ID_is_required", 400);
    }

    if (!uuidRegex.test(id)) {
      throw new AppError("Invalid_user_ID_format", 400);
    }

    const user = await userService.getUserById(id);
    if (!user) throw new AppError("User_not_found", 404);

    res.status(200).json({
      success: true,
      message: "User_fetched_successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};