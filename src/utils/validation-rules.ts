// Centralized validation rules and regex patterns

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Basic format check
  if (!emailRegex.test(email)) return false;
  
  // Additional domain structure check
  const [, domain] = email.split("@");
  if (!domain || domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.split(".").some((part) => part.length < 2)) return false;
  
  return true;
}

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export function isStrongPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  return passwordRegex.test(password);
}

export function requiredField(value: string): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

// New validation functions
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}