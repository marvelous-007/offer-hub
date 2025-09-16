import { Request, Response, NextFunction } from 'express';
import { validateCreateReview, validateUpdateReview, sanitizeReviewComment } from '../utils/review-helpers';
import { CreateReviewDTO, UpdateReviewDTO } from '../types/review.types';

// Middleware to validate review creation
export function validateReviewCreate(req: Request, res: Response, next: NextFunction) {
  const data: CreateReviewDTO = req.body;
  const { valid, errors } = validateCreateReview(data);
  if (!valid) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  // Sanitize comment
  if (data.comment) {
    req.body.comment = sanitizeReviewComment(data.comment);
  }
  next();
}

// Middleware to validate review update
export function validateReviewUpdate(req: Request, res: Response, next: NextFunction) {
  const data: UpdateReviewDTO = req.body;
  const { valid, errors } = validateUpdateReview(data);
  if (!valid) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  // Sanitize comment
  if (data.comment) {
    req.body.comment = sanitizeReviewComment(data.comment);
  }
  next();
}
