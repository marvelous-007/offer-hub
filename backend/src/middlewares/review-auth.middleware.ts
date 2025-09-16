import { Request, Response, NextFunction } from 'express';
import { Review } from '../types/review.types';
import { reviewService } from '../services/review.service';

// Helper to extract user from request (assumes req.user is set by auth middleware)
function getUserFromRequest(req: Request) {
  // If using a custom auth middleware, user info should be attached to req.user
  // Adjust this logic if your project uses a different property
  return (req as any).user;
}

/**
 * Middleware to check if the user is authorized to perform review actions.
 * - Only the user who is the `from_user_id` can create/update/delete their review.
 * - Admins can perform any action.
 */
export async function authorizeReviewAction(req: Request, res: Response, next: NextFunction) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Admins can do anything
    if (user.role === 'admin') return next();

    // For create, from_user_id must match
    if (req.method === 'POST') {
      if (req.body.from_user_id !== user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Cannot create review for another user' });
      }
      return next();
    }

    // For update/delete, check review ownership
    const reviewId = req.params.id;
    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'Review ID required' });
    }
    const review: Review | null = await reviewService.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.from_user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Not the review owner' });
    }
    next();
  } catch (err) {
    next(err);
  }
}
