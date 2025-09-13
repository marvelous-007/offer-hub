import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { AuthenticatedRequest } from "@/types/middleware.types";
import { UserRole } from "@/types/auth.types";

/**
 * Admin Role-Based Access Control Middleware
 * Ensures only admin users can access admin endpoints
 */
export const requireAdminRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError(
      "Admin access required. Insufficient permissions.",
      403
    ));
  }

  next();
};

/**
 * Admin or Super Admin Role-Based Access Control Middleware
 * Allows both admin and super_admin roles
 */
export const requireAdminOrSuperAdminRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!['admin', 'super_admin'].includes(req.user.role)) {
    return next(new AppError(
      "Admin or Super Admin access required. Insufficient permissions.",
      403
    ));
  }

  next();
};
