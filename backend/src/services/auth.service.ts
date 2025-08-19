import { CreateUserDTO } from "@/types/user.types";
import { userService } from "./user.service";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
} from "@/utils/jwt.utils";
import { supabase } from "@/lib/supabase/supabase";
import { AuthUser, LoginDTO, RefreshTokenRecord } from "@/types/auth.types";
import { AppError } from "@/utils/AppError";
import { randomBytes } from "crypto";
import { verifyMessage } from "ethers";

export async function getNonce(wallet_address: string) {
  const nonce = randomBytes(16).toString("hex");
  const { error } = await supabase
    .from("users")
    .update({ nonce })
    .eq("wallet_address", wallet_address);

  if (error) throw new AppError("Failed to set nonce", 500);

  return nonce;
}

export async function signup(data: CreateUserDTO) {
  const newUser = await userService.createUser(data);

  const accessToken = signAccessToken({ user_id: newUser.id });
  const { refreshToken, refreshTokenHash } = signRefreshToken({
    user_id: newUser.id,
  });

  // Save refresh token in DB
  const { error: rtInsertError } = await supabase
    .from("refresh_tokens")
    .insert([
      {
        user_id: newUser.id,
        token_hash: refreshTokenHash,
      },
    ]);

  if (rtInsertError) {
    throw new AppError("Failed to persist refresh token", 500);
  }

  return {
    user: newUser,
    tokens: { accessToken, refreshToken },
  };
}

export async function login(data: LoginDTO) {
  const { wallet_address, signature } = data;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet_address)
    .single();

  if (error || !user) throw new AppError("User not found", 401);

  // Verify signature
  let recoveredAddress: string;
  try {
    recoveredAddress = verifyMessage(user.nonce, signature);
  } catch {
    throw new AppError("Invalid signature", 401);
  }

  if (recoveredAddress.toLowerCase() !== wallet_address.toLowerCase()) {
    throw new AppError("Signature does not match wallet address", 401);
  }

  // Clear nonce after successful login
  await supabase
    .from("users")
    .update({ nonce: null })
    .eq("wallet_address", wallet_address);

  // Issue tokens
  const accessToken = signAccessToken({ user_id: user.id });
  const { refreshToken, refreshTokenHash } = signRefreshToken({
    user_id: user.id,
  });

  await supabase.from("refresh_tokens").insert([
    {
      user_id: user.id,
      token_hash: refreshTokenHash,
    },
  ]);

  return {
    user,
    tokens: { accessToken, refreshToken },
  };
}

export async function refreshSession(tokenRecord: RefreshTokenRecord) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", tokenRecord.user_id)
    .single();

  if (error || !user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken({ user_id: user.id });
  const { refreshToken: newRefreshToken, refreshTokenHash } = signRefreshToken({
    user_id: user.id,
  });

  const { error: rotateError } = await supabase
    .from("refresh_tokens")
    .update({
      token_hash: refreshTokenHash,
      created_at: new Date().toISOString(),
    })
    .eq("token_hash", tokenRecord.token_hash);

  if (rotateError) {
    throw new AppError("Failed to rotate refresh token", 500);
  }

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(refreshToken: string) {
  const refreshTokenHash = hashToken(refreshToken);
  const { error } = await supabase
    .from("refresh_tokens")
    .delete()
    .eq("token_hash", refreshTokenHash);

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

  return user as AuthUser;
}
