import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service";
import { AppError, MissingFieldsError, NotFoundError, ValidationError } from "@/utils/AppError";
import { UserFilters } from "@/types/user.types";
import { buildSuccessResponse, buildPaginatedResponse } from '../utils/responseBuilder';

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

    res.status(201).json(
      buildSuccessResponse(user, "User created successfully")
    );
};

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    if (!id) {
      throw new ValidationError("User ID is required");
    }

    if (!uuidRegex.test(id)) {
      throw new ValidationError("Invalid user ID format");
    }

    const user = await userService.getUserById(id);
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json(
      buildSuccessResponse(user, "User fetched successfully")
    );
  
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const { id } = req.params;

    if (!id) throw new MissingFieldsError("User ID is required");
    
    if (!uuidRegex.test(id)) throw new ValidationError("Invalid user ID format");

    const updateData = req.body;
    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) throw new NotFoundError("User not found");

    // Prepare response with only changed fields
    const changedFields: Record<string, any> = {};
    for (const key of Object.keys(updateData)) {
      if (updatedUser[key] !== undefined) {
        changedFields[key] = updatedUser[key];
      }
    }

    res.status(200).json(
      buildSuccessResponse(changedFields, "User updated successfully")
    );

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
      throw new ValidationError("Page number must be greater than 0");
    }

    if (filters.limit && (filters.limit < 1 || filters.limit > 50)) {
      throw new ValidationError("Limit must be between 1 and 50");
    }

    const result = await userService.getAllUsers(filters);

    res.status(200).json(
      buildPaginatedResponse(
        result.users,
        "Users retrieved successfully",
        {
          current_page: filters.page || 1,
          total_pages: Math.ceil(result.total / (filters.limit || 20)),
          total_items: result.total,
          per_page: filters.limit || 20,
        }
      )
    );

};