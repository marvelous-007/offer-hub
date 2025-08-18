import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service";
import { AppError, MissingFieldsError, NotFoundError, ValidationError } from "@/utils/AppError";
import { UserFilters } from "@/types/user.types";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { wallet_address, username, name, bio, email, is_freelancer } = req.body;

    if (!wallet_address || !username) {
      throw new MissingFieldsError("Missing_required_fields");
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
};

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    if (!id) {
      throw new ValidationError("User_ID_is_required");
    }

    if (!uuidRegex.test(id)) {
      throw new ValidationError("Invalid_user_ID_format");
    }

    const user = await userService.getUserById(id);
    if (!user) throw new NotFoundError("User_not_found");

    res.status(200).json({
      success: true,
      message: "User_fetched_successfully",
      data: user,
    });
  
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const { id } = req.params;

    if (!id) throw new MissingFieldsError("User_ID_is_required");
    
    if (!uuidRegex.test(id)) throw new ValidationError("Invalid_user_ID_format");

    const updateData = req.body;
    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) throw new NotFoundError("User_not_found");

    // Prepare response with only changed fields
    const changedFields: Record<string, any> = {};
    for (const key of Object.keys(updateData)) {
      if (updatedUser[key] !== undefined) {
        changedFields[key] = updatedUser[key];
      }
    }

    res.status(200).json({
      success: true,
      message: "User_updated_successfully",
      data: changedFields,
    });

};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const filters: UserFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string,
      is_freelancer: req.query.is_freelancer !== undefined
        ? req.query.is_freelancer === 'true'
        : undefined,
    };

    // Validate pagination parameters
    if (filters.page && filters.page < 1) {
      throw new ValidationError("Page_number_must_be_greater_than_0");
    }

    if (filters.limit && (filters.limit < 1 || filters.limit > 50)) {
      throw new ValidationError("Limit_must_be_between_1_and_50");
    }

    const result = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: "Users_retrieved_successfully",
      data: result.users,
      pagination: {
        current_page: filters.page || 1,
        total_pages: Math.ceil(result.total / (filters.limit || 20)),
        total_users: result.total,
        per_page: filters.limit || 20,
      },
    });

};