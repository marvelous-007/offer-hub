import { supabase } from "@/lib/supabase/supabase";
import { AppError } from "@/utils/AppError";
import { verifyAccessToken, verifyRefreshToken } from "@/utils/jwt.utils";
import { NextFunction, Request, Response } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Please authenticate to get access", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.user_id)
      .single();

    if (error || !user) {
      return next(
        new AppError("The user that has this token does not exist", 401)
      );
    }

    req.user = user;

    next();
  } catch {
    return next(new AppError("Invalid or expired token", 403));
  }
};

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have sufficient permission for this action",
          403
        )
      );
    }

    next();
  };
}

export const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
      return next(new AppError("Refresh token has expired", 403));
    }

    const { data: tokenRecord, error } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token", refreshToken)
      .single();

    if (error || !tokenRecord) {
      return next(
        new AppError("Invalid refresh token. Please log in again", 403)
      );
    }

    req.refreshTokenRecord = tokenRecord;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 403));
  }
};
