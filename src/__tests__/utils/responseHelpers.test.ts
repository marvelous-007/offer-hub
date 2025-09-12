import { describe, it, expect } from '@jest/globals';
import {
  calculateQualityScore,
  validateResponseContent,
  getResponseStatusColor,
  getEngagementScoreColor,
  sortResponses,
  filterResponses,
  generateResponseStats,
  canUserRespondToReview,
  canUserModerate,
  getResponseTemplates,
  truncateText,
  isMobileDevice
} from '@/utils/responseHelpers';
import { ReviewResponseWithDetails, ResponseStatus } from '@/types/review-responses.types';

describe('responseHelpers', () => {
  describe('calculateQualityScore', () => {
    it('should calculate high quality score for good response', () => {
      const content = 'Thank you for your feedback! I appreciate your honest review and will work on improving the communication aspect for future projects.';
      const score = calculateQualityScore(content);
      expect(score).toBeGreaterThan(70);
    });

    it('should calculate low quality score for poor response', () => {
      const content = 'This review is stupid and unfair.';
      const score = calculateQualityScore(content);
      expect(score).toBeLessThan(50);
    });

    it('should handle empty content', () => {
      const score = calculateQualityScore('');
      expect(score).toBe(50);
    });
  });

  describe('validateResponseContent', () => {
    it('should validate good content', () => {
      const content = 'Thank you for your feedback! I appreciate your honest review.';
      const result = validateResponseContent(content);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject content that is too short', () => {
      const content = 'Thanks';
      const result = validateResponseContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Response must be at least 10 characters long');
    });

    it('should reject content that is too long', () => {
      const content = 'A'.repeat(2001);
      const result = validateResponseContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Response must be less than 2000 characters');
    });

    it('should reject content with prohibited words', () => {
      const content = 'This is spam content';
      const result = validateResponseContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Response contains prohibited content');
    });
  });

  describe('getResponseStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getResponseStatusColor('pending')).toContain('yellow');
      expect(getResponseStatusColor('approved')).toContain('green');
      expect(getResponseStatusColor('rejected')).toContain('red');
      expect(getResponseStatusColor('flagged')).toContain('orange');
    });
  });

  describe('getEngagementScoreColor', () => {
    it('should return correct colors for engagement scores', () => {
      expect(getEngagementScoreColor(4.5)).toBe('text-green-600');
      expect(getEngagementScoreColor(3.5)).toBe('text-yellow-600');
      expect(getEngagementScoreColor(2.5)).toBe('text-orange-600');
      expect(getEngagementScoreColor(1.5)).toBe('text-red-600');
    });
  });

  describe('sortResponses', () => {
    const mockResponses: ReviewResponseWithDetails[] = [
      {
        id: '1',
        review_id: 'review-1',
        responder_id: 'user-1',
        content: 'Response 1',
        status: 'approved',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        responder: { id: 'user-1', name: 'User 1' },
        analytics: { id: '1', response_id: '1', helpful_votes: 5, unhelpful_votes: 1, views_count: 10, engagement_score: 4.2, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        review: { id: 'review-1', rating: 4, comment: 'Good', from_user_id: 'user-2', to_user_id: 'user-1' }
      },
      {
        id: '2',
        review_id: 'review-2',
        responder_id: 'user-2',
        content: 'Response 2',
        status: 'approved',
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
        responder: { id: 'user-2', name: 'User 2' },
        analytics: { id: '2', response_id: '2', helpful_votes: 3, unhelpful_votes: 0, views_count: 8, engagement_score: 3.8, created_at: '2025-01-02T00:00:00Z', updated_at: '2025-01-02T00:00:00Z' },
        review: { id: 'review-2', rating: 5, comment: 'Excellent', from_user_id: 'user-1', to_user_id: 'user-2' }
      }
    ];

    it('should sort by date descending', () => {
      const sorted = sortResponses(mockResponses, 'date', 'desc');
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
    });

    it('should sort by engagement score', () => {
      const sorted = sortResponses(mockResponses, 'engagement', 'desc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
    });
  });

  describe('generateResponseStats', () => {
    it('should calculate correct statistics', () => {
      const mockResponses: ReviewResponseWithDetails[] = [
        {
          id: '1',
          review_id: 'review-1',
          responder_id: 'user-1',
          content: 'Response 1',
          status: 'approved',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          responder: { id: 'user-1', name: 'User 1' },
          analytics: { id: '1', response_id: '1', helpful_votes: 5, unhelpful_votes: 1, views_count: 10, engagement_score: 4.2, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
          review: { id: 'review-1', rating: 4, comment: 'Good', from_user_id: 'user-2', to_user_id: 'user-1' }
        },
        {
          id: '2',
          review_id: 'review-2',
          responder_id: 'user-2',
          content: 'Response 2',
          status: 'pending',
          created_at: '2025-01-02T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
          responder: { id: 'user-2', name: 'User 2' },
          analytics: { id: '2', response_id: '2', helpful_votes: 3, unhelpful_votes: 0, views_count: 8, engagement_score: 3.8, created_at: '2025-01-02T00:00:00Z', updated_at: '2025-01-02T00:00:00Z' },
          review: { id: 'review-2', rating: 5, comment: 'Excellent', from_user_id: 'user-1', to_user_id: 'user-2' }
        }
      ];

      const stats = generateResponseStats(mockResponses);
      expect(stats.total).toBe(2);
      expect(stats.approved).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.responseRate).toBe(50);
      expect(stats.totalViews).toBe(18);
    });
  });

  describe('canUserRespondToReview', () => {
    it('should allow user to respond if they received the review', () => {
      const canRespond = canUserRespondToReview('user-1', 'user-1', []);
      expect(canRespond).toBe(true);
    });

    it('should not allow user to respond if they did not receive the review', () => {
      const canRespond = canUserRespondToReview('user-1', 'user-2', []);
      expect(canRespond).toBe(false);
    });

    it('should not allow user to respond if they already responded', () => {
      const existingResponses = [
        {
          responder_id: 'user-1'
        } as ReviewResponseWithDetails
      ];
      const canRespond = canUserRespondToReview('user-1', 'user-1', existingResponses);
      expect(canRespond).toBe(false);
    });
  });

  describe('canUserModerate', () => {
    it('should allow moderators to moderate', () => {
      expect(canUserModerate('moderator')).toBe(true);
      expect(canUserModerate('admin')).toBe(true);
    });

    it('should not allow regular users to moderate', () => {
      expect(canUserModerate('user')).toBe(false);
      expect(canUserModerate(undefined)).toBe(false);
    });
  });

  describe('getResponseTemplates', () => {
    it('should return templates for different ratings', () => {
      const templates5 = getResponseTemplates(5);
      expect(templates5).toHaveLength(2);
      expect(templates5[0]).toContain('5-star review');

      const templates1 = getResponseTemplates(1);
      expect(templates1).toHaveLength(2);
      expect(templates1[0]).toContain('poor experience');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'A'.repeat(200);
      const truncated = truncateText(longText, 100);
      expect(truncated).toHaveLength(103); // 100 + '...'
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const truncated = truncateText(shortText, 100);
      expect(truncated).toBe(shortText);
    });

    it('should handle mobile truncation', () => {
      const longText = 'A'.repeat(200);
      const truncated = truncateText(longText, 100, true);
      expect(truncated).toHaveLength(103); // 100 + '...'
    });
  });

  describe('isMobileDevice', () => {
    it('should detect mobile device', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      expect(isMobileDevice()).toBe(true);
    });

    it('should detect desktop device', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      
      expect(isMobileDevice()).toBe(false);
    });
  });
});
