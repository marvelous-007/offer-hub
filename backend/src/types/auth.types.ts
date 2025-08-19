import { User } from "@supabase/supabase-js";

export type UserRole = "freelancer" | "client" | "admin";

export interface JWTPayload {
  user_id: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthUser extends User {
  role: UserRole;
}

export interface RefreshTokenRecord {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
}

export interface LoginDTO {
  username: string;
  wallet_address: string;
}
