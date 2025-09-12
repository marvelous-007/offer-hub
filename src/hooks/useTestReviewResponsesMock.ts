import { useState, useEffect } from 'react';

// Mock user data for testing
const MOCK_USER = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'client'
};

export function useTestReviewResponsesMock() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock responses data
  const mockResponses = [
    {
      id: 'response-1',
      review_id: 'test-review-1',
      responder_id: 'user-456',
      content: 'Thank you for the positive feedback! I really enjoyed working on this project and I\'m glad it exceeded your expectations. I look forward to future collaborations.',
      status: 'approved',
      created_at: '2025-01-11T00:00:00Z',
      responder: {
        id: 'user-456',
        name: 'John Doe',
        avatar: '/person1.png'
      },
      analytics: {
        helpful_votes: 8,
        unhelpful_votes: 1,
        views_count: 25,
        engagement_score: 4.2
      }
    },
    {
      id: 'response-2',
      review_id: 'test-review-1',
      responder_id: 'user-789',
      content: 'I appreciate your detailed feedback. The communication throughout the project was indeed a key factor in its success.',
      status: 'approved',
      created_at: '2025-01-12T00:00:00Z',
      responder: {
        id: 'user-789',
        name: 'Jane Smith',
        avatar: '/person2.png'
      },
      analytics: {
        helpful_votes: 5,
        unhelpful_votes: 0,
        views_count: 18,
        engagement_score: 4.5
      }
    }
  ];

  // Create a response (mock implementation)
  const createResponse = async (reviewId: string, content: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Simulate success
      const newResponse = {
        id: `response-${Date.now()}`,
        review_id: reviewId,
        responder_id: MOCK_USER.id,
        content,
        status: 'pending',
        created_at: new Date().toISOString(),
        responder: {
          id: MOCK_USER.id,
          name: MOCK_USER.name,
          avatar: '/person1.png'
        },
        analytics: {
          helpful_votes: 0,
          unhelpful_votes: 0,
          views_count: 0,
          engagement_score: 0
        }
      };

      setResponses(prev => [...prev, newResponse]);
      return newResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get responses for a review (mock implementation)
  const getResponses = async (reviewId: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Return mock data
      setResponses(mockResponses);
      return mockResponses;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vote on a response (mock implementation)
  const voteResponse = async (responseId: string, voteType: 'helpful' | 'unhelpful') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Update local state
      setResponses(prev => prev.map(resp => {
        if (resp.id === responseId) {
          return {
            ...resp,
            analytics: {
              ...resp.analytics,
              [voteType === 'helpful' ? 'helpful_votes' : 'unhelpful_votes']: 
                (resp.analytics[voteType === 'helpful' ? 'helpful_votes' : 'unhelpful_votes'] || 0) + 1
            }
          };
        }
        return resp;
      }));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  // Load responses on component mount
  useEffect(() => {
    getResponses('test-review-1');
  }, []);

  return {
    responses,
    loading,
    error,
    createResponse,
    getResponses,
    voteResponse,
    user: MOCK_USER
  };
}
