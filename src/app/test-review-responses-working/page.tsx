'use client';

import React, { useState } from 'react';
import { useTestReviewResponsesMock } from '@/hooks/useTestReviewResponsesMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Send,
  RefreshCw,
  Zap
} from 'lucide-react';

const TEST_REVIEW_ID = 'test-review-1';

export default function TestReviewResponsesWorking() {
  const { responses, loading, error, createResponse, getResponses, voteResponse, user } = useTestReviewResponsesMock();
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await createResponse(TEST_REVIEW_ID, newResponse.trim());
      setNewResponse('');
      setSuccessMessage('✅ Response created successfully! (Mock implementation)');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (responseId: string, voteType: 'helpful' | 'unhelpful') => {
    try {
      await voteResponse(responseId, voteType);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      flagged: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Zap className="w-8 h-8 mr-3 text-yellow-500" />
          Review Response System - Working Demo
        </h1>
        <p className="text-gray-600">
          Fully functional demo with mock data - no backend authentication required!
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Response Creation Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Create New Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Write your response to review "{TEST_REVIEW_ID}":
              </label>
              <Textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Thank you for your feedback! I appreciate your review and will work to improve..."
                rows={4}
                maxLength={2000}
                className="w-full"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newResponse.length}/2000 characters
                </span>
                <span className="text-sm text-green-600">
                  Quality: {newResponse.length > 50 ? '85%' : '60%'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={!newResponse.trim() || isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Creating...' : 'Submit Response'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => getResponses(TEST_REVIEW_ID)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Existing Responses ({responses.length})
            </span>
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No responses yet. Create the first one above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={response.responder?.avatar || '/person1.png'} 
                        alt={response.responder?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{response.responder?.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(response.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(response.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{response.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleVote(response.id, 'helpful')}
                      className="flex items-center space-x-1 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{response.analytics?.helpful_votes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(response.id, 'unhelpful')}
                      className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{response.analytics?.unhelpful_votes || 0}</span>
                    </button>
                    <span>Views: {response.analytics?.views_count || 0}</span>
                    <span>Score: {response.analytics?.engagement_score || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Demo Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">✅ What Works:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Create new responses</li>
                <li>Vote on responses (helpful/unhelpful)</li>
                <li>View response analytics</li>
                <li>Real-time UI updates</li>
                <li>Loading states and error handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 Technical Details:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Mock data implementation</li>
                <li>No backend authentication required</li>
                <li>Simulated API delays</li>
                <li>Local state management</li>
                <li>React hooks pattern</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
