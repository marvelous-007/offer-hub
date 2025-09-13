import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ReviewResponseService } from '../services/review-response.service';
import { 
  CreateReviewResponseDTO, 
  UpdateReviewResponseDTO,
  ModerateReviewResponseDTO,
  VoteResponseDTO,
  ReviewResponseErrorCodes
} from '../types/review-responses.types';

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        maybeSingle: jest.fn(),
        single: jest.fn(),
        order: jest.fn(() => ({
          range: jest.fn()
        }))
      })),
      range: jest.fn()
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn()
    })),
    raw: jest.fn()
  }))
};

jest.mock('@/lib/supabase/supabase', () => ({
  supabase: mockSupabase
}));

describe('ReviewResponseService', () => {
  let service: ReviewResponseService;
  let mockReviewData: any;
  let mockResponseData: any;

  beforeEach(() => {
    service = new ReviewResponseService();
    jest.clearAllMocks();

    mockReviewData = {
      id: 'review-123',
      to_user_id: 'user-456',
      rating: 4,
      comment: 'Great work!',
      from_user_id: 'user-789'
    };

    mockResponseData = {
      id: 'response-123',
      review_id: 'review-123',
      responder_id: 'user-456',
      content: 'Thank you for the feedback!',
      status: 'pending',
      created_at: '2025-01-12T00:00:00Z',
      updated_at: '2025-01-12T00:00:00Z'
    };
  });

  describe('createResponse', () => {
    it('should create a response successfully', async () => {
      const dto: CreateReviewResponseDTO = {
        review_id: 'review-123',
        content: 'Thank you for the feedback! I appreciate your honest review.'
      };

      // Mock review validation
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: mockReviewData,
        error: null
      });

      // Mock existing response check
      mockSupabase.from().select().eq().eq().maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      // Mock response creation
      mockSupabase.from().insert().select().single.mockResolvedValueOnce({
        data: mockResponseData,
        error: null
      });

      const result = await service.createResponse(dto, 'user-456');

      expect(result).toEqual(mockResponseData);
      expect(mockSupabase.from).toHaveBeenCalledWith('review_responses');
    });

    it('should throw error if user is not authorized to respond', async () => {
      const dto: CreateReviewResponseDTO = {
        review_id: 'review-123',
        content: 'Thank you for the feedback!'
      };

      // Mock review validation with different user
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { ...mockReviewData, to_user_id: 'user-999' },
        error: null
      });

      await expect(service.createResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.UNAUTHORIZED_TO_RESPOND);
    });

    it('should throw error if response already exists', async () => {
      const dto: CreateReviewResponseDTO = {
        review_id: 'review-123',
        content: 'Thank you for the feedback!'
      };

      // Mock review validation
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: mockReviewData,
        error: null
      });

      // Mock existing response check
      mockSupabase.from().select().eq().eq().maybeSingle.mockResolvedValueOnce({
        data: mockResponseData,
        error: null
      });

      await expect(service.createResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_ALREADY_EXISTS);
    });

    it('should throw error for content that is too short', async () => {
      const dto: CreateReviewResponseDTO = {
        review_id: 'review-123',
        content: 'Thanks'
      };

      await expect(service.createResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_TOO_SHORT);
    });

    it('should throw error for content that is too long', async () => {
      const dto: CreateReviewResponseDTO = {
        review_id: 'review-123',
        content: 'A'.repeat(2001)
      };

      await expect(service.createResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_TOO_LONG);
    });
  });

  describe('getResponsesByReview', () => {
    it('should fetch responses for a review', async () => {
      const mockResponses = [mockResponseData];

      mockSupabase.from().select().eq().eq().order().mockResolvedValueOnce({
        data: mockResponses,
        error: null
      });

      const result = await service.getResponsesByReview('review-123');

      expect(result).toEqual(mockResponses);
      expect(mockSupabase.from).toHaveBeenCalledWith('review_responses');
    });

    it('should return empty array if no responses found', async () => {
      mockSupabase.from().select().eq().eq().order().mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.getResponsesByReview('review-123');

      expect(result).toEqual([]);
    });
  });

  describe('updateResponse', () => {
    it('should update a response successfully', async () => {
      const dto: UpdateReviewResponseDTO = {
        content: 'Updated response content'
      };

      const updatedResponse = { ...mockResponseData, content: dto.content };

      // Mock get response by ID
      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: { ...mockResponseData, responder: { id: 'user-456', name: 'John Doe' } },
        error: null
      });

      // Mock update
      mockSupabase.from().update().eq().select().single.mockResolvedValueOnce({
        data: updatedResponse,
        error: null
      });

      const result = await service.updateResponse('response-123', dto, 'user-456');

      expect(result).toEqual(updatedResponse);
    });

    it('should throw error if response not found', async () => {
      const dto: UpdateReviewResponseDTO = {
        content: 'Updated response content'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      await expect(service.updateResponse('response-123', dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_NOT_FOUND);
    });

    it('should throw error if user is not authorized to update', async () => {
      const dto: UpdateReviewResponseDTO = {
        content: 'Updated response content'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: { ...mockResponseData, responder_id: 'user-999' },
        error: null
      });

      await expect(service.updateResponse('response-123', dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.UNAUTHORIZED_TO_RESPOND);
    });

    it('should throw error if response is not pending', async () => {
      const dto: UpdateReviewResponseDTO = {
        content: 'Updated response content'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: { ...mockResponseData, status: 'approved' },
        error: null
      });

      await expect(service.updateResponse('response-123', dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_NOT_PENDING);
    });
  });

  describe('deleteResponse', () => {
    it('should delete a response successfully', async () => {
      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: { ...mockResponseData, responder_id: 'user-456' },
        error: null
      });

      mockSupabase.from().delete().eq().mockResolvedValueOnce({
        error: null
      });

      await expect(service.deleteResponse('response-123', 'user-456'))
        .resolves.not.toThrow();
    });

    it('should throw error if response not found', async () => {
      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      await expect(service.deleteResponse('response-123', 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_NOT_FOUND);
    });
  });

  describe('moderateResponse', () => {
    it('should moderate a response successfully', async () => {
      const dto: ModerateReviewResponseDTO = {
        status: 'approved',
        moderation_notes: 'Response approved after review'
      };

      const moderatedResponse = { ...mockResponseData, status: 'approved' };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: mockResponseData,
        error: null
      });

      mockSupabase.from().update().eq().select().single.mockResolvedValueOnce({
        data: moderatedResponse,
        error: null
      });

      const result = await service.moderateResponse('response-123', dto, 'moderator-123');

      expect(result).toEqual(moderatedResponse);
    });

    it('should throw error if response not found', async () => {
      const dto: ModerateReviewResponseDTO = {
        status: 'approved'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      await expect(service.moderateResponse('response-123', dto, 'moderator-123'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_NOT_FOUND);
    });
  });

  describe('voteOnResponse', () => {
    it('should vote on a response successfully', async () => {
      const dto: VoteResponseDTO = {
        response_id: 'response-123',
        vote_type: 'helpful'
      };

      mockSupabase.from().select().eq().eq().maybeSingle.mockResolvedValueOnce({
        data: mockResponseData,
        error: null
      });

      mockSupabase.from().select().eq().eq().maybeSingle.mockResolvedValueOnce({
        data: null, // No existing vote
        error: null
      });

      mockSupabase.from().insert().mockResolvedValueOnce({
        error: null
      });

      mockSupabase.from().update().eq().mockResolvedValueOnce({
        error: null
      });

      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { helpful_votes: 5, unhelpful_votes: 1 },
        error: null
      });

      const result = await service.voteOnResponse(dto, 'user-456');

      expect(result).toEqual({
        total_helpful: 5,
        total_unhelpful: 1
      });
    });

    it('should throw error if response not found', async () => {
      const dto: VoteResponseDTO = {
        response_id: 'response-123',
        vote_type: 'helpful'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      await expect(service.voteOnResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.RESPONSE_NOT_FOUND);
    });

    it('should throw error if user already voted', async () => {
      const dto: VoteResponseDTO = {
        response_id: 'response-123',
        vote_type: 'helpful'
      };

      mockSupabase.from().select().eq().maybeSingle.mockResolvedValueOnce({
        data: mockResponseData,
        error: null
      });

      mockSupabase.from().select().eq().eq().maybeSingle.mockResolvedValueOnce({
        data: { id: 'vote-123' }, // Existing vote
        error: null
      });

      await expect(service.voteOnResponse(dto, 'user-456'))
        .rejects.toThrow(ReviewResponseErrorCodes.VOTE_ALREADY_EXISTS);
    });
  });

  describe('getPendingResponses', () => {
    it('should fetch pending responses', async () => {
      const mockPendingResponses = [mockResponseData];

      mockSupabase.from().select().eq().order().range().mockResolvedValueOnce({
        data: mockPendingResponses,
        error: null
      });

      const result = await service.getPendingResponses(50, 0);

      expect(result).toEqual(mockPendingResponses);
    });
  });

  describe('getResponseAnalytics', () => {
    it('should calculate response analytics', async () => {
      const mockResponses = [
        {
          id: 'response-1',
          status: 'approved',
          created_at: '2025-01-12T00:00:00Z',
          analytics: {
            helpful_votes: 5,
            unhelpful_votes: 1,
            views_count: 10,
            engagement_score: 4.2
          }
        },
        {
          id: 'response-2',
          status: 'approved',
          created_at: '2025-01-12T00:00:00Z',
          analytics: {
            helpful_votes: 3,
            unhelpful_votes: 0,
            views_count: 8,
            engagement_score: 3.8
          }
        }
      ];

      mockSupabase.from().select().mockResolvedValueOnce({
        data: mockResponses,
        error: null
      });

      const result = await service.getResponseAnalytics();

      expect(result.total_responses).toBe(2);
      expect(result.response_rate).toBe(100);
      expect(result.engagement_metrics.total_views).toBe(18);
      expect(result.engagement_metrics.total_helpful_votes).toBe(8);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      mockSupabase.from().update().eq().mockResolvedValueOnce({
        error: null
      });

      await expect(service.incrementViewCount('response-123'))
        .resolves.not.toThrow();
    });
  });
});
