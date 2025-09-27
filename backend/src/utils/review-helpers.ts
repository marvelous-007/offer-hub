// Utility helpers for review processing, validation, and sanitization
import { CreateReviewDTO, UpdateReviewDTO } from '../types/review.types';

/**
 * Validate review creation input
 * @param data CreateReviewDTO
 * @returns { valid: boolean, errors: string[] }
 */
export function validateCreateReview(data: CreateReviewDTO) {
  const errors: string[] = [];
  if (!data.from_user_id) errors.push('from_user_id is required');
  if (!data.to_user_id) errors.push('to_user_id is required');
  if (!data.contract_id) errors.push('contract_id is required');
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push('rating must be a number between 1 and 5');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate review update input
 * @param data UpdateReviewDTO
 * @returns { valid: boolean, errors: string[] }
 */
export function validateUpdateReview(data: UpdateReviewDTO) {
  const errors: string[] = [];
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    errors.push('rating must be between 1 and 5');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize review comment (basic)
 */
export function sanitizeReviewComment(comment?: string): string | undefined {
  if (!comment) return undefined;
  // Remove script tags and trim whitespace
  return comment.replace(/<script.*?>.*?<\/script>/gi, '').trim();
}
