import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewResponseInterface from '@/components/reviews/review-responses/ReviewResponseInterface';
import ResponseCreation from '@/components/reviews/review-responses/ResponseCreation';
import ResponseDisplay from '@/components/reviews/review-responses/ResponseDisplay';
import ResponseModeration from '@/components/reviews/review-responses/ResponseModeration';
import ResponseAnalytics from '@/components/reviews/review-responses/ResponseAnalytics';
import { ReviewResponseWithDetails } from '@/types/review-responses.types';

// Mock the hooks
jest.mock('@/hooks/useReviewResponses', () => ({
  useReviewResponses: jest.fn(() => ({
    responses: [],
    isLoading: false,
    error: null,
    createResponse: jest.fn(),
    updateResponse: jest.fn(),
    deleteResponse: jest.fn(),
    voteOnResponse: jest.fn(),
    refetch: jest.fn()
  })),
  useResponseGuidelines: jest.fn(() => ({
    guidelines: {
      professional_tone: 'Use professional language',
      specificity: 'Be specific',
      gratitude: 'Show gratitude',
      action_items: 'Mention improvements',
      length_guidelines: 'Keep responses concise',
      examples: {
        good: 'Thank you for your feedback!',
        bad: 'This review is unfair.'
      },
      validation_rules: {
        min_length: 10,
        max_length: 2000,
        prohibited_content: ['spam', 'harassment']
      }
    },
    isLoading: false,
    error: null,
    refetch: jest.fn()
  }))
}));

jest.mock('@/hooks/useResponseModeration', () => ({
  useResponseModeration: jest.fn(() => ({
    pendingResponses: [],
    isLoading: false,
    error: null,
    moderateResponse: jest.fn(),
    refetch: jest.fn()
  })),
  useResponseAnalytics: jest.fn(() => ({
    analytics: null,
    isLoading: false,
    error: null,
    fetchAnalytics: jest.fn()
  }))
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago')
}));

describe('ReviewResponseInterface', () => {
  const mockProps = {
    reviewId: 'review-123',
    currentUserId: 'user-456',
    userRole: 'user',
    onResponseCreated: jest.fn(),
    onResponseUpdated: jest.fn(),
    onResponseDeleted: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ReviewResponseInterface {...mockProps} />);
    expect(screen.getByText('Review Responses')).toBeInTheDocument();
  });

  it('shows create response button when user can respond', () => {
    render(<ReviewResponseInterface {...mockProps} />);
    expect(screen.getByText('Write Response')).toBeInTheDocument();
  });

  it('shows guidelines button', () => {
    render(<ReviewResponseInterface {...mockProps} />);
    expect(screen.getByText('Guidelines')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    const { useReviewResponses } = require('@/hooks/useReviewResponses');
    useReviewResponses.mockReturnValue({
      responses: [],
      isLoading: true,
      error: null,
      createResponse: jest.fn(),
      updateResponse: jest.fn(),
      deleteResponse: jest.fn(),
      voteOnResponse: jest.fn(),
      refetch: jest.fn()
    });

    render(<ReviewResponseInterface {...mockProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const { useReviewResponses } = require('@/hooks/useReviewResponses');
    useReviewResponses.mockReturnValue({
      responses: [],
      isLoading: false,
      error: 'Failed to load responses',
      createResponse: jest.fn(),
      updateResponse: jest.fn(),
      deleteResponse: jest.fn(),
      voteOnResponse: jest.fn(),
      refetch: jest.fn()
    });

    render(<ReviewResponseInterface {...mockProps} />);
    expect(screen.getByText(/Failed to load responses/)).toBeInTheDocument();
  });
});

describe('ResponseCreation', () => {
  const mockProps = {
    reviewId: 'review-123',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isLoading: false,
    guidelines: {
      professional_tone: 'Use professional language',
      specificity: 'Be specific',
      gratitude: 'Show gratitude',
      action_items: 'Mention improvements',
      length_guidelines: 'Keep responses concise',
      examples: {
        good: 'Thank you for your feedback!',
        bad: 'This review is unfair.'
      },
      validation_rules: {
        min_length: 10,
        max_length: 2000,
        prohibited_content: ['spam', 'harassment']
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResponseCreation {...mockProps} />);
    expect(screen.getByText('Write Response')).toBeInTheDocument();
  });

  it('shows character count', () => {
    render(<ResponseCreation {...mockProps} />);
    expect(screen.getByText('0/2000')).toBeInTheDocument();
  });

  it('validates content length', async () => {
    render(<ResponseCreation {...mockProps} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Short' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Response must be at least 10 characters/)).toBeInTheDocument();
    });
  });

  it('shows quality score', async () => {
    render(<ResponseCreation {...mockProps} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { 
      target: { value: 'Thank you for your feedback! I appreciate your honest review and will work on improving the communication aspect for future projects.' } 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Quality:/)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when form is submitted', async () => {
    render(<ResponseCreation {...mockProps} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { 
      target: { value: 'Thank you for your feedback! I appreciate your honest review and will work on improving the communication aspect for future projects.' } 
    });
    
    const submitButton = screen.getByText('Submit Response');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        'Thank you for your feedback! I appreciate your honest review and will work on improving the communication aspect for future projects.'
      );
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ResponseCreation {...mockProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });
});

describe('ResponseDisplay', () => {
  const mockResponse: ReviewResponseWithDetails = {
    id: 'response-123',
    review_id: 'review-123',
    responder_id: 'user-456',
    content: 'Thank you for your feedback!',
    status: 'approved',
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
    responder: {
      id: 'user-456',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    },
    analytics: {
      id: 'analytics-123',
      response_id: 'response-123',
      helpful_votes: 5,
      unhelpful_votes: 1,
      views_count: 10,
      engagement_score: 4.2,
      created_at: '2025-01-12T00:00:00Z',
      updated_at: '2025-01-12T00:00:00Z'
    },
    review: {
      id: 'review-123',
      rating: 4,
      comment: 'Great work!',
      from_user_id: 'user-789',
      to_user_id: 'user-456'
    }
  };

  const mockProps = {
    response: mockResponse,
    currentUserId: 'user-999',
    userRole: 'user',
    onVote: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    showModerationActions: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResponseDisplay {...mockProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays response content', () => {
    render(<ResponseDisplay {...mockProps} />);
    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
  });

  it('shows analytics data', () => {
    render(<ResponseDisplay {...mockProps} />);
    expect(screen.getByText('5')).toBeInTheDocument(); // helpful votes
    expect(screen.getByText('1')).toBeInTheDocument(); // unhelpful votes
    expect(screen.getByText('10')).toBeInTheDocument(); // views
    expect(screen.getByText('4.2')).toBeInTheDocument(); // engagement score
  });

  it('shows voting buttons for approved responses', () => {
    render(<ResponseDisplay {...mockProps} />);
    expect(screen.getByText('Helpful')).toBeInTheDocument();
    expect(screen.getByText('Not Helpful')).toBeInTheDocument();
  });

  it('calls onVote when voting button is clicked', () => {
    render(<ResponseDisplay {...mockProps} />);
    
    const helpfulButton = screen.getByText('Helpful');
    fireEvent.click(helpfulButton);
    
    expect(mockProps.onVote).toHaveBeenCalledWith('response-123', 'helpful');
  });

  it('shows edit and delete buttons for response owner', () => {
    const propsWithOwner = {
      ...mockProps,
      currentUserId: 'user-456',
      response: { ...mockResponse, status: 'pending' as const }
    };
    
    render(<ResponseDisplay {...propsWithOwner} />);
    
    // Should show action menu button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('ResponseModeration', () => {
  const mockResponses: ReviewResponseWithDetails[] = [
    {
      id: 'response-123',
      review_id: 'review-123',
      responder_id: 'user-456',
      content: 'Thank you for your feedback!',
      status: 'pending',
      created_at: '2025-01-12T00:00:00Z',
      updated_at: '2025-01-12T00:00:00Z',
      responder: {
        id: 'user-456',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg'
      },
      analytics: {
        id: 'analytics-123',
        response_id: 'response-123',
        helpful_votes: 0,
        unhelpful_votes: 0,
        views_count: 0,
        engagement_score: 0,
        created_at: '2025-01-12T00:00:00Z',
        updated_at: '2025-01-12T00:00:00Z'
      },
      review: {
        id: 'review-123',
        rating: 4,
        comment: 'Great work!',
        from_user_id: 'user-789',
        to_user_id: 'user-456'
      }
    }
  ];

  const mockProps = {
    responses: mockResponses,
    onModerate: jest.fn(),
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResponseModeration {...mockProps} />);
    expect(screen.getByText('Response Moderation')).toBeInTheDocument();
  });

  it('shows statistics', () => {
    render(<ResponseModeration {...mockProps} />);
    expect(screen.getByText('1')).toBeInTheDocument(); // Total responses
    expect(screen.getByText('1')).toBeInTheDocument(); // Pending responses
  });

  it('shows moderation buttons for pending responses', () => {
    render(<ResponseModeration {...mockProps} />);
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
    expect(screen.getByText('Flag')).toBeInTheDocument();
  });

  it('shows filters', () => {
    render(<ResponseModeration {...mockProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });
});

describe('ResponseAnalytics', () => {
  const mockAnalytics = {
    total_responses: 10,
    response_rate: 80.5,
    quality_score: 85.2,
    engagement_metrics: {
      total_views: 150,
      total_helpful_votes: 45,
      total_unhelpful_votes: 5,
      average_engagement_score: 4.2
    }
  };

  const mockProps = {
    analytics: mockAnalytics,
    filters: {},
    onFilterChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResponseAnalytics {...mockProps} />);
    expect(screen.getByText('Response Analytics Dashboard')).toBeInTheDocument();
  });

  it('displays key metrics', () => {
    render(<ResponseAnalytics {...mockProps} />);
    expect(screen.getByText('10')).toBeInTheDocument(); // Total responses
    expect(screen.getByText('80.5%')).toBeInTheDocument(); // Response rate
    expect(screen.getByText('85.2')).toBeInTheDocument(); // Quality score
    expect(screen.getByText('4.2')).toBeInTheDocument(); // Engagement score
  });

  it('shows engagement metrics', () => {
    render(<ResponseAnalytics {...mockProps} />);
    expect(screen.getByText('150')).toBeInTheDocument(); // Total views
    expect(screen.getByText('45')).toBeInTheDocument(); // Helpful votes
    expect(screen.getByText('5')).toBeInTheDocument(); // Unhelpful votes
  });

  it('shows performance indicators', () => {
    render(<ResponseAnalytics {...mockProps} />);
    expect(screen.getByText('Performance Indicators')).toBeInTheDocument();
  });

  it('shows insights and recommendations', () => {
    render(<ResponseAnalytics {...mockProps} />);
    expect(screen.getByText('Insights & Recommendations')).toBeInTheDocument();
  });

  it('handles empty analytics', () => {
    const propsWithEmptyAnalytics = {
      ...mockProps,
      analytics: null
    };
    
    render(<ResponseAnalytics {...propsWithEmptyAnalytics} />);
    expect(screen.getByText('No analytics data available')).toBeInTheDocument();
  });
});
