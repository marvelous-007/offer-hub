import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as any) || "24h";
const JWT_REFRESH_EXPIRES_IN =
  (process.env.JWT_REFRESH_EXPIRES_IN as any) || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment");
}

export function signAccessToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function signRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
}
