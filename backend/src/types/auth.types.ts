/**
 * @fileoverview Type definitions for authentication-related data structures
 * @author Offer Hub Team
 */

export type UserRole = "freelancer" | "client" | "admin" | "moderator";

export interface JWTPayload {
  user_id: string;
  role?: UserRole;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  wallet_address: string;
  username: string;
  name?: string;
  bio?: string;
  email?: string;
  is_freelancer?: boolean;
  nonce?: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface RefreshTokenRecord {
  id: string;
  user_id: string;
  token_hash: string;
  created_at: string;
  expires_at?: string;
  device_info?: DeviceInfo;
  is_active: boolean;
}

export interface DeviceInfo {
  user_agent: string;
  ip_address: string;
  device_type?: string;
  location?: string;
}

export interface LoginDTO {
  wallet_address: string;
  signature: string;
}

// Email/Password Authentication Types
export interface EmailLoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      tokenType: string;
    };
    session: {
      id: string;
      created_at: string;
      expires_at: string;
    };
  };
  metadata: {
    timestamp: string;
    requestId: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      tokenType: string;
    };
  };
  metadata: {
    timestamp: string;
    requestId: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  metadata: {
    timestamp: string;
    requestId: string;
  };
}

export interface AuthError {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
  metadata: {
    timestamp: string;
    requestId: string;
  };
}

export interface AuditLogEntry {
  id: string;
  user_id?: string;
  action: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'token_refresh' | 'password_change';
  ip_address: string;
  user_agent: string;
  timestamp: string;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionInfo {
  id: string;
  user_id: string;
  device_info: DeviceInfo;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
}

export interface UserSessionsResponse {
  success: boolean;
  data: {
    sessions: SessionInfo[];
    total: number;
  };
  metadata: {
    timestamp: string;
  };
}
