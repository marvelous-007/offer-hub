import { CreateUserDTO } from "@/types/user.types";
import { userService } from "./user.service";
import { signAccessToken, signRefreshToken } from "@/utils/jwt.utils";
import { supabase } from "@/lib/supabase/supabase";
import { LoginDTO } from "@/types/auth.types";
import { AppError } from "@/utils/AppError";
import { User } from "@supabase/supabase-js";

export async function signup(data: CreateUserDTO) {
  const newUser = await userService.createUser(data);

  const accessToken = signAccessToken({ user_id: newUser.id });
  const refreshToken = signRefreshToken({ user_id: newUser.id });

  // Save refresh token in DB
  await supabase.from("refresh_tokens").insert([
    {
      user_id: newUser.id,
      token: refreshToken,
    },
  ]);

  return {
    user: newUser,
    tokens: { accessToken, refreshToken },
  };
}

export async function login(data: LoginDTO) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", data.wallet_address)
    .eq("username", data.username)
    .single();

  if (error || !user) throw new AppError("Invalid credentials", 401);

  const accessToken = signAccessToken({ user_id: user.id });
  const refreshToken = signRefreshToken({ user_id: user.id });

  await supabase.from("refresh_tokens").insert([
    {
      user_id: user.id,
      token: refreshToken,
    },
  ]);

  return {
    user,
    tokens: { accessToken, refreshToken },
  };
}

export async function refreshSession(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken({ user_id: user.id });

  return { accessToken };
}

export async function logoutUser(refreshToken: string) {
  const { error } = await supabase
    .from("refresh_tokens")
    .delete()
    .eq("token", refreshToken);

  if (error) throw new AppError(error.message, 500);

  return { message: "Logged out successfully" };
}

export async function getMe(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) throw new AppError("User not found", 404);

  return user as User;
}
